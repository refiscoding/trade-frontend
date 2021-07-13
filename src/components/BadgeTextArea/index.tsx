import * as React from 'react'

import { TagsInput, Tags, Tag, Input, TagTitle, TagCloseIcon } from './styles'

type BadgeTextareaProps = {
  handleSetTags: (tags: string[]) => void
}

const TextAreaWithTags: React.FC<BadgeTextareaProps> = ({ handleSetTags }) => {
  const [tags, setTags] = React.useState<Array<string>>([])
  const [value, setValue] = React.useState<string>('')

  const removeTags = (indexToRemove: number) => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
  }

  const addTags = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === 13) {
      // Space Bar Pressed 32, Enter Pressed 13
      const newTags = [...tags, value]
      setTags(newTags)
      handleSetTags(newTags)
      setValue('')
    }
  }
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }
  return (
    <TagsInput>
      <Tags>
        {tags.map((tag, index) => (
          <Tag key={`${index}_${tag}`}>
            <TagTitle className="tag-title">{tag}</TagTitle>
            <TagCloseIcon className="tag-close-icon" onClick={() => removeTags(index)}>
              x
            </TagCloseIcon>
          </Tag>
        ))}
      </Tags>
      <Input
        value={value}
        type="text"
        placeholder="Press enter to add tags"
        onKeyUp={(event) => addTags(event)}
        onChange={(event) => handleChange(event)}
      />
    </TagsInput>
  )
}

export default TextAreaWithTags
