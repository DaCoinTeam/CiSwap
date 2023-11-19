"use client"
import { Button, Chip, Input, Textarea } from "@nextui-org/react"
import React, { useContext, } from "react"
import { FormikPropsContext } from "../formik"
import { NumberInput, TitleDisplay } from "@app/_shared"
import { PlusIcon } from "@heroicons/react/24/outline"
const InputFields = () => {
    const formik = useContext(FormikPropsContext)
    if (formik == null) return

    const _handleAddButton = () => {
        const tags = formik.values.tags
        const _tagInput = formik.values._tagInput
        if (tags.includes(_tagInput)) return
        tags.push(_tagInput)
        formik.setFieldValue("_tagInput", "")
        formik.setFieldValue("tags", tags)
    }

    const _handleFloorChange = (value: string) => formik.setFieldValue("floor", value)
    
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
                <TitleDisplay title="Name"/>
                <Input
                    id="name"
                    radius="sm"
                    labelPlacement="outside"
                    placeholder="StarCi #1"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    isInvalid={!!(formik.errors.name && formik.touched.name)}
                    errorMessage={formik.touched.name && formik.errors.name}
                /> 
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-1">
                    <TitleDisplay title="Collection"/>
                    <Input
                        id="collection"
                        radius="sm"
                        labelPlacement="outside"
                        placeholder="Ignore them haters"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.collection}
                        isInvalid={!!(formik.errors.collection && formik.touched.collection)}
                        errorMessage={formik.touched.collection && formik.errors.collection}
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <TitleDisplay title="External URL"/>
                    <Input
                        id="externalUrl"
                        radius="sm"
                        labelPlacement="outside"
                        placeholder="https://www.facebook.com/starci183"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.externalUrl}
                        isInvalid={!!(formik.errors.externalUrl && formik.touched.externalUrl)}
                        errorMessage={formik.touched.externalUrl && formik.errors.externalUrl}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <TitleDisplay title="Floor"/>
                <NumberInput
                    onValueChange={_handleFloorChange}
                    value={formik.values.floor}
                    endContent={<span className="text-default-400 text-sm">
                        STARCI
                    </span>}
                /> 
            </div>
           
            <div className="flex flex-col gap-1">
                <TitleDisplay title="Description"/>
                <Textarea
                    id="description"
                    radius="sm"
                    labelPlacement="outside"
                    placeholder="Da Coin Team is da best"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    isInvalid={!!(formik.errors.description && formik.touched.description)}
                    errorMessage={formik.touched.description && formik.errors.description}
                    classNames={
                        {
                            label: "p-0",
                            helperWrapper: "p-0"
                        }
                    }
                />
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <TitleDisplay title="Tags"/>
                    <div className="flex gap-4">
                        <Input
                            id="_tagInput"
                            radius="sm"
                            labelPlacement="outside"
                            placeholder="https://www.facebook.com/starci183"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values._tagInput}
                            isInvalid={!!(formik.errors._tagInput && formik.touched._tagInput)}
                            errorMessage={formik.touched._tagInput && formik.errors._tagInput}
                        />
                        <Button isIconOnly variant="light" onPress={_handleAddButton}>
                            <PlusIcon className="w-6 h-6"/>
                        </Button>
                    </div>
                    
                </div>
                <div className="flex flex-wrap gap-2">
                    {
                        formik.values.tags.map((tag, index) => <Chip color={_renderColor(index)} variant="flat" onClose={() => {}} key={tag}> {tag} </Chip>)
                    }
                </div>
            </div>
        </div>
    )
}

export default InputFields

const _renderColor = (index: number) => {
    switch(index){
    case 0: return "primary" 
    case 1: return "success"
    case 2: return "warning" 
    case 3: return "secondary"
    case 4: return "danger" 
    default: return undefined
    }
} 
