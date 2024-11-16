// import { createOrder, updateGameQuantity } from "@/libs/apis";
// import sanityClient from "@/libs/sanity";
// import { GameSubset, Games } from "@/models/games";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: "2024-06-20",
// });

// export async function POST(req: Request, res: Response) {
//   const { cartItems, userEmail } = await req.json();
//   console.log(cartItems);
//   const origin = req.headers.get("origin");

//   // Checking quantity against what we have from sanity
//   const updatedItmes: GameSubset[] =
//     (await fetchAndCalculateItemPricesAndQuatity(cartItems)) as GameSubset[];

//   //   console.log("updated items", updatedItmes);
//   try {
//     const session = await stripe.checkout.sessions.create({
//       line_items: updatedItmes.map((item) => ({
//         quantity: item.quantity,
//         adjustable_quantity: {
//           enabled: true,
//           maximum: item.maxQuantity,
//           minimum: 1,
//         },
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: item.name,
//             images: [item.images[0].url],
//           },
//           unit_amount: parseInt((item.price * 100).toString()),
//         },
//       })),
//       payment_method_types: ["card"],
//       billing_address_collection: "required",
//       mode: "payment",
//       success_url: `${origin}/?success=true`,
//     });
//     await updateGameQuantity(updatedItmes);

//     await createOrder(updatedItmes, userEmail);

//     return NextResponse.json(session, {
//       status: 200,
//       statusText: "Payment Successful",
//     });
//   } catch (error: any) {
//     // use our own price
//     console.log("error", error);
//     return new NextResponse(error, { status: 500 });
//   }
// }

// async function fetchAndCalculateItemPricesAndQuatity(cartItems: Games[]) {
//   const query = `*[_type=="game" && _id in $itemsIds]{
//     _id,
//     name,
//     price,
//     quantity,
//     images,
//    }`;
//   try {
//     // From local storage
//     const itemsId = cartItems.map((item) => item._id);
//     // From sanity
//     const sanityItems: GameSubset[] = await sanityClient.fetch({
//       query,
//       params: { itemsId },
//     });
//     // console.log(sanityItems);

//     const updatedItems: GameSubset[] = sanityItems.map((item) => ({
//       ...item,
//       maxQuantity: item.quantity,
//     }));

//     // check quantity
//     if (checkQuantitiesAgainstSanity(cartItems, updatedItems)) {
//       return new NextResponse(
//         "Quantity has been updated, pleas update the cart",
//         { status: 500 }
//       );
//     }
//     // Calculate prices
//     const calculatedItemPrices: GameSubset[] = updatedItems.map((item) => {
//       const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);
//       return {
//         _id: item._id,
//         name: item.name,
//         images: item.images,
//         quantity: cartItem?.quantity as number,
//         maxQuantity: item.quantity,
//         price: item.price,
//       };
//     });
//     console.log(calculatedItemPrices);
//     return calculatedItemPrices;
//   } catch (error) {
//     return new NextResponse(
//       "Quantity has been updated, pleas update the cart",
//       { status: 500 }
//     );
//   }
// }

// function checkQuantitiesAgainstSanity(
//   cartItems: Games[],
//   sanityItems: GameSubset[]
// ) {
//   for (let i = 0; i < cartItems.length; i++) {
//     const cartItem = cartItems[i];
//     const sanityItem = sanityItems[i];

//     if (cartItem.quantity <= sanityItem.quantity) {
//       return false;
//     }
//   }
//   return true;
// }

// --------------------------------------------------------------------------------------------------
// import Stripe from 'stripe';
// import { NextResponse } from 'next/server';

// import { createOrder, updateGameQuantity } from './../../../libs/apis';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
// 	apiVersion: '2024-08-16',
// });

// import sanityClient from '@/libs/Sanity';
// import { Game, GameSubset } from '@/models/game';

// export async function POST(req: Request, res: Response) {
// 	const { cartItems, userEmail } = await req.json();
// 	const origin = req.headers.get('origin');
//     // console.log("here")
//     // console.log(origin)
//     // console.log(parseInt((item.price * 100).toString()))
// 	const updatedItems: GameSubset[] =
// 		(await fetchAndCalculateItemPricesAndQuantity(cartItems)) as GameSubset[];
//     console.log(updatedItems)
// 	try {
// 		console.log("before sesson")
// 		const session = await stripe.checkout.sessions.create({
// 			line_items: updatedItems.map(item => {
//                 // console.log((item.price * 100).toString())
// 				// console.log(item.quantity,item.maxQuantity,item.name,item.image[0].url, parseInt((item.price * 100).toString()))
//                 return ({
// 				quantity: item.quantity,
// 				adjustable_quantity: {
// 					enabled: true,
// 					maximum: item.maxQuantity,
// 					minimum: 1,
// 				},
// 				price_data: {
// 					currency: 'usd' || 'inr',
// 					product_data: {
// 						name: item.name,
// 						images: [item.image[0].url],
// 					},
// 					unit_amount: parseInt((item.price * 100).toString()),
// 				},
// 			})}),
// 			payment_method_types: ['card'],
// 			billing_address_collection: 'required',
// 			mode: 'payment',
// 			success_url: `${origin}/?success=true`,
// 			phone_number_collection: { enabled: true },
// 		});
// 		console.log("after session")
// 		await updateGameQuantity(updatedItems);

// 		await createOrder(updatedItems, userEmail);
		
// 		return NextResponse.json(session, {
// 			status: 200,
// 			statusText: 'payment successful',
// 		});
// 	} catch (error: any) {
// 		console.log('ERROR==', error);
// 		return new NextResponse(error, { status: 500 });
// 	}
// }

// async function fetchAndCalculateItemPricesAndQuantity(cartItems: Game[]) {
// 	const query = `*[_type == "game" && _id in $itemIds] {
//         _id,
//         name,
//         price,
//         quantity,
//         image
//     }`;

// 	try {
// 		// Fetch items from sanity based on game IDS
// 		const itemIds = cartItems.map(item => item._id);
// 		const sanityItems: GameSubset[] = await sanityClient.fetch({
// 			query,
// 			params: { itemIds },
// 		});

// 		const updatedItems: GameSubset[] = sanityItems.map(item => ({
// 			...item,
// 			maxQuantity: item.quantity,
// 		}));

// 		// Check the quantity
// 		if (checkQuantitiesAgainstSanity(cartItems, updatedItems)) {
// 			return new NextResponse(
// 				'Quantiy has been updated, please update your cart',
// 				{ status: 500 }
// 			);
// 		}

// 		// calculate prices
// 		const calculatedItemPrices: GameSubset[] = updatedItems.map(item => {
// 			const cartItem = cartItems.find(cartItem => cartItem._id === item._id);

// 			return {
// 				_id: item._id,
// 				name: item.name,
// 				image: item.image,
// 				quantity: cartItem?.quantity as number,
// 				maxQuantity: item.quantity,
// 				price: item.price,
// 			};
// 		});

// 		return calculatedItemPrices;
// 	} catch (error) {
// 		return new NextResponse(
// 			'Quantiy has been updated, please update your cart',
// 			{ status: 500 }
// 		);
// 	}
// }

// function checkQuantitiesAgainstSanity(
// 	cartItems: Game[],
// 	sanityItems: GameSubset[]
// ) {
// 	for (let i = 0; i < cartItems.length; i++) {
// 		const cartItem = cartItems[i];
// 		const sanityItem = sanityItems[i];

// 		if (cartItem.quantity <= sanityItem.quantity) {
// 			return false;
// 		}
// 	}

// 	return true;
// }
// --------------------------------------------------------------------------------------------------

import { createOrder, updateGameQuantity } from "@/libs/apis";
import sanityClient from "@/libs/sanity";
import { GameSubset, Games } from "@/models/games";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const { cartItems, userEmail } = await req.json();
  const origin = req.headers.get("origin");

  try {
    // Fetch updated items from Sanity and check quantities
    console.log(cartItems);
    console.log(userEmail);
    const updatedItems = await fetchAndCalculateItemPricesAndQuantity(cartItems);

    const session = await stripe.checkout.sessions.create({
      line_items: updatedItems.map((item) => ({
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

    // Update game quantities and create order
    await updateGameQuantity(updatedItems);
    await createOrder(updatedItems, userEmail);

    return NextResponse.json(session, {
      status: 200,
      statusText: "Payment Successful",
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

async function fetchAndCalculateItemPricesAndQuantity(cartItems: Games[]) {
  const query = `*[_type=="game" && _id in $itemsId]{
    _id,
    name,
    price,
    quantity,
    images,
  }`;

  const itemsId = cartItems.map((item) => item._id);

  try {
    const sanityItems: GameSubset[] = await sanityClient.fetch(query, { itemsId });
    const updatedItems: GameSubset[] = sanityItems.map((item) => ({
      ...item,
      maxQuantity: item.quantity,
    }));

    if (!checkQuantitiesAgainstSanity(cartItems, updatedItems)) {
      throw new Error("Insufficient quantity for some items, please update your cart.");
    }

    return updatedItems.map((item) => {
      const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);
      return {
        ...item,
        quantity: cartItem?.quantity as number,
      };
    });
  } catch (error) {
    console.error("Error fetching or calculating quantities:", error);
    throw new Error("Error with cart quantity or data fetch. Please try again.");
  }
}

function checkQuantitiesAgainstSanity(cartItems: Games[], sanityItems: GameSubset[]) {
  return cartItems.every((cartItem, index) => cartItem.quantity <= sanityItems[index].quantity);
}
