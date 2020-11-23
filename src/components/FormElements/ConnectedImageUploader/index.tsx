import { Flex, FlexProps, IconButton, Text, useToast } from '@chakra-ui/core'
import { useField } from 'formik'
import { Variants } from 'framer-motion'
import * as React from 'react'
import { FilePlus, RefreshCcw, Trash2 } from 'react-feather'
import { FillLoader, MotionFlex } from '../../'
import { ERROR_TOAST, SUCCESS_TOAST } from '../../../constants'
import { EMPTY_FILE } from '../../../constants/index'
import { UploadFile } from '../../../generated/graphql'
import strapiHelpers from '../../../utils/strapiHelpers'
import { AddFileButton, AddFileWrapper, HiddenInput, Wrapper } from './styles'

type ImageUploaderProps = FlexProps & {
  name: string
  onUploadComplete?: (file: UploadFile) => void
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ name, onUploadComplete, ...rest }) => {
  const [stateFile, setStateFile] = React.useState<File | undefined>()
  const [uploading, setUploading] = React.useState(false)
  const [field, meta, helpers] = useField<UploadFile>(name)

  const inputRef = React.createRef<HTMLInputElement>()

  const toast = useToast()

  React.useEffect(() => {
    const handleUpload = async (file: File) => {
      setUploading(true)
      try {
        const strapiFile = await strapiHelpers.upload(file)
        toast({ description: 'Image has been uploaded.', ...SUCCESS_TOAST })
        helpers.setValue(strapiFile.data[0])
        if (onUploadComplete) {
          onUploadComplete(strapiFile.data[0])
        }
        setUploading(false)
      } catch (e) {
        setUploading(false)
        toast({
          description: 'Something went wrong while uploading your photo.',
          ...ERROR_TOAST
        })
      }
    }
    if (stateFile) {
      handleUpload(stateFile)
    }
    // eslint-disable-next-line
  }, [stateFile])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      setStateFile(files[0])
    }
  }

  const variants: Variants = {
    in: {
      opacity: 1
    },
    initial: {
      opacity: 0
    },
    hover: {
      backgroundColor: 'rgba(0,0,0,0.05)',
      cursor: 'pointer'
    }
  }

  const localUrl = stateFile ? window.URL.createObjectURL(stateFile) : ''

  const buttonsVariant: Variants = {
    initial: {
      y: 60,
      opacity: 0,
      pointerEvents: 'none'
    },
    hover: {
      y: stateFile || !!field.value?.id ? 0 : 60,
      opacity: 1,
      pointerEvents: 'auto',
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const handleRefresh = () => {
    if (inputRef?.current) {
      inputRef.current.click()
    }
  }

  return (
    <Wrapper {...rest}>
      <AddFileWrapper
        animate="in"
        rounded="md"
        initial="initial"
        whileHover="hover"
        variants={variants}
        backgroundImage={`url(${field.value ? field.value.url : localUrl})`}
      >
        <AddFileButton
          rounded="md"
          width="100%"
          align="center"
          htmlFor={name}
          justify="center"
          borderWidth={1}
          minHeight="300px"
        >
          {!stateFile && !!!field.value?.id && (
            <Flex justify="center" align="center">
              <FilePlus size={20} />
              <Text ml={3}>Add Picture</Text>
            </Flex>
          )}
          <MotionFlex
            p={4}
            right={0}
            bottom={0}
            position="absolute"
            variants={buttonsVariant}
            justifyContent="space-around"
          >
            <IconButton
              mr={3}
              rounded="md"
              icon={Trash2}
              aria-label="Clear Image"
              onClick={() => (field.value ? helpers.setValue(EMPTY_FILE) : setStateFile(undefined))}
              variantColor="brand"
            />
            <IconButton
              rounded="md"
              icon={RefreshCcw}
              onClick={handleRefresh}
              aria-label="Update Image"
              variantColor="brand"
            />
          </MotionFlex>
          {uploading && <FillLoader bg="rgba(0,0,0,0.2)" />}
        </AddFileButton>
      </AddFileWrapper>
      <HiddenInput ref={inputRef} onChange={onChange} type="file" multiple name={name} id={name} />
      {meta.touched && meta.error ? (
        <Text color="red.500" textAlign="right">
          {meta.error}
        </Text>
      ) : null}
    </Wrapper>
  )
}

export default React.memo(ImageUploader)
