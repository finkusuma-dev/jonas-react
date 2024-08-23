import { useState } from 'react';

import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

import useLoggedUser from './useLoggedUser';
import { useUpdateUser } from './useUpdateUser';
import styled from 'styled-components';
import { useRef } from 'react';

const Image = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 10px;
  border: 1px solid var(--color-grey-300);
  padding: 8px;
  border-radius: var(--border-radius-sm);
  display: block;
`;

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data,
  // because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: {
        fullName: currentFullName,
        avatar: currentAvatar = null,
      },
    } = {},
  } = useLoggedUser();

  const { update, isUpdating } = useUpdateUser();
  const formRef = useRef(0);

  const [fullName, setFullName] = useState(currentFullName);
  const [avatarPreview, setAvatarPreview] = useState(currentAvatar);

  const isChanged =
    fullName !== currentFullName || avatarPreview !== currentAvatar;

  // console.log('avatar', avatarPreview);
  // console.log('currentAvatar', currentAvatar);

  // const avatarPreview = avatarPreview;
  // typeof avatar !== 'string' && avatar.name && URL.createObjectURL(avatar);

  // console.log('avatar', avatar);
  // console.log('avatarPreview', avatarPreview);

  function handleSubmit(e) {
    e.preventDefault();

    if (!fullName.length) return;

    // console.log('fullName', fullName, 'avatar', avatar, typeof avatar);
    update(
      {
        fullName,
        avatar: avatarPreview,
      },
      {
        onSuccess: (data) => {
          console.log('onsuccess user', data.user);
          setAvatarPreview(data.user.user_metadata.avatar);
          e.target.reset();
        },
      }
    );
  }

  function handleReset() {
    // console.log('formRef', formRef.current, 'e.target', e.target);
    formRef.current.reset();
    setFullName(currentFullName);
    setAvatarPreview(currentAvatar);
  }

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <div>
          {avatarPreview && (
            <Image src={avatarPreview} defaultValue={avatarPreview} />
          )}
          <FileInput
            id="avatar"
            accept="image/*"
            onChange={(e) =>
              setAvatarPreview(URL.createObjectURL(e.target.files[0]))
            }
            disabled={isUpdating}
          />
        </div>
      </FormRow>
      <FormRow>
        <Button
          type="reset"
          variation="secondary"
          disabled={isUpdating || !isChanged}
          onClick={handleReset}
        >
          Cancel
        </Button>
        <Button disabled={isUpdating || !isChanged}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
