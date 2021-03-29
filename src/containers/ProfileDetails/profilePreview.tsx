import * as React from 'react'

import PersonalDetailsComponent from "./PersonalDetails";
import { UsersPermissionsUser } from '../../generated/graphql';

type ProfileProps = {
  user?: UsersPermissionsUser
};

const ProfileDetailsView: React.FC<ProfileProps> = ({ user }) => {
  return (
   <React.Fragment>
      <PersonalDetailsComponent user={user}/>
   </React.Fragment>
  )
}

export default ProfileDetailsView
