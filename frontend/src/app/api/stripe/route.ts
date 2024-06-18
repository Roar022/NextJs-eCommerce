import sanityClient from "@/libs/sanity";
import { GameSubset, Games } from "@/models/games";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-01-29",
});
export async function POST(req: Request, res: Response) {
  const cartItems = (await req.json()) as Games[];
  const origin = req.headers.get("origin");
  const updatedItmes: GameSubset[] =
    (await fetchAndCalculateItemPricesAndQuatity(cartItems)) as GameSubset[];

  //   console.log("updated items", updatedItmes);
  // Checking quantity against what we have from sanity
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: updatedItmes.map((item) => ({
        quantity: item.quantity,
        adjustable_quantity: {
          enabled: true,
          maximum: item.maxQuantity,
          minimum: 1,
        },
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.images[0].url],
          },
          unit_amount: parseInt((item.price * 100).toString()),
        },
      })),
      payment_method_types: ["card"],
      billing_address_collection: "required",
      mode: "payment",
      success_url: `${origin}/?success=true`,
    });
    return NextResponse.json(session, {
      status: 200,
      statusText: "Payment Successful",
    });
  } catch (error: any) {
    // use our own price
    console.log("error", error);
    return new NextResponse(error, { status: 500 });
  }
}

async function fetchAndCalculateItemPricesAndQuatity(cartItems: Games[]) {
  const query = `*[_type=="game" && _id in $itemsIds]{
    _id,
    name,
    price,
    quantity,
    images,
   }`;
  try {
    const itemsId = cartItems.map((item) => item._id);
    const sanityItems: GameSubset[] = await sanityClient.fetch({
      query,
      params: { itemsId },
    });
    // console.log(sanityItems);
    const updatedItems: GameSubset[] = sanityItems.map((item) => ({
      ...item,
      maxQuantity: item.quantity,
    }));
    // check quantity
    if (checkQuantitiesAgainstSanity(cartItems, updatedItems)) {
      return new NextResponse(
        "Quantity has been updated, pleas update the cart",
        { status: 500 }
      );
    }
    // Calculate prices
    const calculatedItemPrices: GameSubset[] = updatedItems.map((item) => {
      const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);
      return {
        _id: item._id,
        name: item.name,
        images: item.images,
        quantity: cartItem?.quantity as number,
        maxQuantity: item.quantity,
        price: item.price,
      };
    });
    return calculatedItemPrices;
    // console.log(calculatedItemPrices);
  } catch (error) {
    return new NextResponse(
      "Quantity has been updated, pleas update the cart",
      { status: 500 }
    );
  }
}

function checkQuantitiesAgainstSanity(
  cartItems: Games[],
  sanityItems: GameSubset[]
) {
  for (let i = 0; i < cartItems.length; i++) {
    const cartItem = cartItems[i];
    const sanityItem = sanityItems[i];

    if (cartItem.quantity <= sanityItem.quantity) {
      return false;
    }
    return true;
  }
}
