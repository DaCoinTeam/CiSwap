"use client"
import React, { useContext, useEffect, useState } from "react"
import { FormikPropsContext } from "../FormikProviders"
import { Button, Image } from "@nextui-org/react"
import { CameraIcon } from "@heroicons/react/24/outline"
import { createBlobUrlFromImageFile } from "@utils"

const UploadImage = () => {
    const formik = useContext(FormikPropsContext)
    if (formik === null) return

    const [imageBlobUrl, setImageBlobUrl] = useState("")

    const imageFile = formik.values.imageFile
    useEffect(() => {
        if (imageFile === null) return
        const _url = createBlobUrlFromImageFile(imageFile)
        if (_url === null) return 
        setImageBlobUrl(_url)
    }, [imageFile])

    const _handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files === null) return
        const file = files[0]
        if (file === null) return
        formik.setFieldValue("imageFile", file)
    }

    const _handleButtonClick = () => {
        const fileInput = document.getElementById("upload")
        if (fileInput) {
            fileInput.click()
        }
    }

    console.log(formik.errors) 
    return (
        <>
            {imageBlobUrl ?
                <div className="grid gap-4">
                    <Button onPress={_handleButtonClick} isIconOnly className="bg-white w-full h-full grid place-items-center">
                        <Image isZoomed className="w-full" src={imageBlobUrl}/>
                    </Button> 
                    
                </div>
                :
                <div className="grid items-center">
                    <div className="aspect-square">
                        <Button onPress={_handleButtonClick} isIconOnly variant="light" className="w-full h-full grid place-items-center">
                            <CameraIcon className="text-teal-500 w-12 h-12"/>
                        </Button> 
                    </div>
                </div>
            }
            <input
                type="file"
                id="upload"
                accept="image/*"
                onChange={_handleUpload}
                className="hidden"
            />
        </>    
    )
}

export default UploadImage