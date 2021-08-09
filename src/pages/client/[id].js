import React, {useEffect, useState} from "react";

import firebase from "firebase/app"
import FirebaseInit from "../../components/Firebase/FirebaseInit";

import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { createCheckoutSession } from "next-stripe/client";


import JobClientView from "../../components/Job/JobClientView"
import NewJobClientView from "../../components/Job/NewJobClientView"

import { Button, Typography, Modal } from "@material-ui/core"


export const getStaticPaths = async () => {
    // Return a list of possible value for id
    FirebaseInit()
    const paths = await firebase.firestore().collection("clients").get()
    .then((query) => {
            const paths = query.docs.map((doc) => {
            // doc.data() is never undefined for query doc snapshots
            return {params: { id: doc.id }} 
            });
    
            return paths
        
    })

    return {
        paths,
        fallback: false
      }

    
  }
  
export const getStaticProps = async (context) =>  {
    const id = context.params.id

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2020-08-27",
    });
  
    const prices = await stripe.prices.list({
      active: true,
      limit: 10,
      expand: ["data.product"],
    });

    console.log(prices.data)
        
  return { props: {clientId: id, products: prices.data}}
}

export const checkout = async (job, jobId, clientId) => {
    const session = await createCheckoutSession({
      success_url: window.location.href,
      cancel_url: window.location.href,
      line_items: [{
            price_data: {
                currency: "usd",
                product_data: {
                    name: job.job
                },
                unit_amount: job.estimate * 100,
            },
            quantity: 1,
            
      }],
      payment_method_types: ["card"],
      mode: "payment",
      metadata: {
        jobId: jobId,
        clientId: clientId
      }
    });
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
    if (stripe) {
      stripe.redirectToCheckout({ sessionId: session.id })
      
    }
  };

  
export default function Client({clientId, products}) {

    const [client, setClient] = useState(null)
    const [jobIds, setJobIds] = useState([])
    const [page, setPage] = useState(null)

    const date = new Date()

    useEffect(() => {
        firebase.firestore().collection("clients").doc(clientId).get()
        .then((doc) => {
        let client = doc.data()

        firebase.firestore().collection("clients").doc(clientId).collection("jobs")
        .onSnapshot((querySnapshot) => {

        setJobIds([])

        querySnapshot.forEach(function(doc) {
            setJobIds(jobIds => ([...jobIds, doc.id]))
        })

        setClient(client)

        })
      })
    }, []);

    console.log(products)


    if (client) {

        const clientStyle = {
            backgroundColor: "#FFFFF0",
            padding: "10px",
        }

        return (
          <div style={clientStyle}>
              <div style={{display: "inline"}}>
                <Button style={{float: "right"}} variant="outlined" color="secondary" onClick={() => 
                setPage("newJob")}>+ Job </Button>
              </div>
            
            
            
            <Typography variant="h4" color="secondary"> {client.name} </Typography>
            <Typography variant="h5" color="secondary"> {client.address} </Typography>
            <Typography variant="h5" color="secondary"> {client.email} </Typography>
            <Typography variant="h5" color="secondary"> {client.phone} </Typography>
            <br />

            {page === "newJob" ? 
            <Modal 
            open={true} 
            onClose={() => setPage(null)}
            style={{
              marginTop: 75,
              overflowY: "auto",
              overflowX: "hidden"
            }}>
            <NewJobClientView products={products} clientId={clientId} closeModal={() => setPage(null)} />
            </Modal>
            :
            null
            }
            
    
    
            {jobIds.length > 0 ? jobIds.map((jobId, index) => {
              return [<JobClientView key={index} date={date} checkout={checkout} clientId={clientId} jobId={jobId} />,
              <br />]
              
            })
            :
            null}
    
            <br />
    
          </div>
        )
      }
    
      else {
        return (
          <div>
          </div>
        )
    }
  }
