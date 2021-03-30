import {
  Button,
  Flex,
  FormLabel,
  IconButton,
  Image,
  Progress,
  Text,
  useToast
} from '@chakra-ui/core'
import { useField } from 'formik'
import * as React from 'react'
import { Check, File } from 'react-feather'
import { get, SpaceProps } from 'styled-system'
import { ERROR_TOAST } from '../../../constants'
import { UploadFile } from '../../../generated/graphql'
import { theme } from '../../../theme'
import strapiHelpers from '../../../utils/strapiHelpers'
import { AddFileButton, FileWrapper, HiddenInput, Wrapper } from './styles'

const { colors } = theme

type FileUploaderProps = SpaceProps & {
  name: string
  placeholder?: string
  label?: string
  onUpload?: (id: string | string[]) => void
  isMulti?: boolean
  isDisabled?: boolean
  setImages?: (value: any[]) => void
  isImage?: boolean
  showUploadButton?: boolean
}

type ProgressObject = {
  state: string
  percentage: number
}

type UploadProgress = {
  [key: string]: ProgressObject
}

const FileUploader: React.FC<FileUploaderProps> = ({
  name,
  placeholder,
  label,
  isMulti,
  isDisabled,
  setImages,
  isImage,
  showUploadButton,
  ...rest
}) => {
  const [stateFiles, setStateFiles] = React.useState<File[]>([])
  const [uploading, setUploading] = React.useState(false)
  const [{ value }, meta, helpers] = useField<UploadFile | UploadFile[]>(name)
  const [uploadProgress, setUploadProgress] = React.useState<UploadProgress>({})

  const renderProgress = (fileName: string) => {
    const progress = uploadProgress[fileName]
    if (uploading) {
      return (
        <Progress
          left={0}
          right={0}
          bottom={0}
          height="2px"
          color="green"
          hasStripe={true}
          isAnimated={true}
          position="absolute"
          value={progress?.percentage || 0}
        />
      )
    }
  }

  const toast = useToast()

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = (e.target.files as unknown) as File[]
    if (files) {
      setStateFiles((prevFiles) => prevFiles?.concat(Array.from(files)))
      setImages && setImages(files)
    }
  }

  const progress = ({ loaded, total }: ProgressEvent, file: File): void => {
    const copy = { ...uploadProgress }
    copy[file.name] = {
      state: 'pending',
      percentage: Math.round((loaded * 100) / total)
    }
    setUploadProgress((prevProgress) => ({ ...prevProgress, ...copy }))
  }

  const handleUpload = async () => {
    const promises = stateFiles.map((file) => strapiHelpers.upload(file, progress))
    setUploading(true)
    try {
      const uploadArr = await Promise.all(promises)
      const uploads = isMulti ? uploadArr.map((upload) => upload.data[0]) : uploadArr[0].data[0]
      setStateFiles([])
      helpers.setValue(uploads)
      setUploading(false)
    } catch (e) {
      setUploading(false)
      toast({
        description: 'Something went wrong while uploading your file.',
        ...ERROR_TOAST
      })
    }
  }

  function determineType(toBeDetermined: UploadFile | UploadFile[]): toBeDetermined is UploadFile {
    if (toBeDetermined instanceof Array) {
      return false
    }
    return true
  }

  React.useEffect(() => {
    if (isMulti && value && value instanceof Array) {
      setStateFiles(stateFiles.filter((e) => value.some((f) => `${f.name}${f.ext}` !== e.name)))
    } else if (value && determineType(value) && value.name) {
      setStateFiles(stateFiles.filter((e) => e.name.replace(/\.[^/.]+$/, '') !== `${value.name}`))
    }
    // eslint-disable-next-line
  }, [value])

  return (
    <Wrapper mb={4} {...rest}>
      {label && <FormLabel htmlFor={label}>{label}</FormLabel>}
      {value && value instanceof Array && (
        <Wrapper>
          {value.map((file: UploadFile) => {
            return (
              <FileWrapper justify="space-between" p={4} key={file.name}>
                <Flex align="center">
                  {file?.mime?.includes('image/') ? (
                    <Image mr={3} rounded="md" width="70px" height="auto" src={file.url} />
                  ) : (
                    <File color={theme.colors.brand[300]} />
                  )}
                  <Text ml={4} isTruncated>
                    {file.name}
                  </Text>
                </Flex>
                <Check size={20} color={get(colors, 'green.500', 'green')} />
              </FileWrapper>
            )
          })}
        </Wrapper>
      )}
      {value && determineType(value) && value.name && (
        <Wrapper>
          <FileWrapper justify="space-between" p={4} key={value.name}>
            <Flex align="center">
              {value.mime.includes('image/') ? (
                <Image rounded="md" width="70px" height="auto" src={value.url} />
              ) : (
                <File color={theme.colors.brand[300]} />
              )}
              <Text ml={4} isTruncated>
                {value.name}
              </Text>
            </Flex>
            <Check size={20} color={get(colors, 'green.500', 'green')} />
          </FileWrapper>
        </Wrapper>
      )}
      {stateFiles &&
        stateFiles.length > 0 &&
        stateFiles.map((file: File) => {
          const progress = uploadProgress[file.name]
          const isImage = file.type.includes('image/')
          return (
            <FileWrapper justify="space-between" p={4} key={file.name}>
              <Flex align="center">
                {!!isImage ? (
                  <Image
                    mr={3}
                    rounded="md"
                    width="70px"
                    height="auto"
                    src={window.URL.createObjectURL(file)}
                  />
                ) : (
                  <File color={theme.colors.brand[300]} />
                )}
                <Text ml={4} maxWidth="180px" isTruncated>
                  {file.name}
                </Text>
              </Flex>
              {progress && progress.state === 'done' ? (
                <Check size={20} color={theme.colors.success[300]} />
              ) : (
                <Flex>
                  <IconButton
                    size="xs"
                    icon="close"
                    aria-label="Remove File"
                    onClick={() => setStateFiles(stateFiles.filter((e) => e.name !== file.name))}
                  />
                </Flex>
              )}
              {renderProgress(file.name)}
            </FileWrapper>
          )
        })}
      <Flex mt={!!label ? 0 : 2} justifyContent="flex-end" width="100%" flexDirection="row">
        {stateFiles && stateFiles.length > 0 && !isMulti ? null : (
          <AddFileButton
            isDisabled={isDisabled}
            htmlFor={name}
            mr={stateFiles && stateFiles.length > 0 ? 4 : 0}
          >
            <Text>{placeholder}</Text>
          </AddFileButton>
        )}
        {showUploadButton && stateFiles && stateFiles.length > 0 && (
          <Button isLoading={uploading} flex={1} onClick={() => handleUpload()}>
            <Text>Upload</Text>
          </Button>
        )}
      </Flex>
      <HiddenInput
        disabled={isDisabled}
        onChange={onChange}
        type="file"
        accept={isImage ? "image/png, image/jpeg" : ""}
        multiple={isMulti}
        name={name}
        id={name}
      />
      {/* TODO: Figure out how to make this work with meta.touched condition */}
      {meta.error ? (
        <Text color="red.500" textAlign="left">
          {get(meta.error, 'id', '')}
        </Text>
      ) : null}
    </Wrapper>
  )
}

FileUploader.defaultProps = {
  placeholder: 'Add Files',
  isMulti: false
}

export default FileUploader
