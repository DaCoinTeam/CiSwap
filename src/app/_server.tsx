import { GetServerSideProps } from "next"
import React, { Fragment } from "react"

export const getServerSideProps = (async (context) => {
    console.log("Hello World")
    return { props: { } }
}) satisfies GetServerSideProps
   

const Server = () => {
    return <Fragment/>
}

export default Server