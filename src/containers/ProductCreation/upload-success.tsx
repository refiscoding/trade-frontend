import * as React from 'react'
import InfoPage from '../../components/InfoPage'
import { PageWrap } from '../../layouts'
import { images } from '../../theme'
import { useHistory } from 'react-router-dom'

const UploadSuccess: React.FC = () => {
  const history = useHistory()
  return (
    <PageWrap
      title="Upload Success"
      align="center"
      backgroundSize="cover"
      justify="center"
      pt={0}
    >
      <InfoPage
        image={images.uploadProductSuccess}
        header="Success!"
        caption={`
          Your product has been listed. 
          You can always edit or remove the product in the 
          “Product Management” section in the hamburger menu. 
        `}
        action={() => history.push('/product-management')}
        actionText="OK"
      />
    </PageWrap>
  )
}

export default UploadSuccess
