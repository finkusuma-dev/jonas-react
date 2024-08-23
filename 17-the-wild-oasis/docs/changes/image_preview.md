# Image Preview

Shows image preview on the cabin form & user's profile form to can see the preview of the current image or selected image you want to upload.

![image preview](https://drive.google.com/thumbnail?id=1Y9qKwiGW4Z8mIAEPC291r-CKqVtJNerW&sz=w600)

## Code

/src/features/cabins/CreateCabinForm.jsx

```jsx

function CreateCabinForm({ cabinToEdit, onCloseModal }) {

  ...

  // Add a new state for the image preview
  const [imagePreview, setImagePreview] = useState(cabinToEdit?.image);

  ...

  return (
  <Form onSubmit= ...
    ...
    <FormRow label="Description" errorMsg={errors?.description?.message}>
      <div>
        {/* Add Image (stylized img) component.
         *  Dont forget to wrap this component and the next component in a div.
        */}
        {(imagePreview) && (
          <Image
            src={imagePreview}
            defaultValue={imagePreview}
          />
        )}

        <FileInput
          id="image"
          accept="image/*"
          disabled={isBusy}
          {...register('image', {
            required: isEdit ? false : 'This field is required',

            // Handle FileInput onChange event handler and set the image preview
            onChange: (e) => {
              setImagePreview(URL.createObjectURL(e.target.files[0]));
            },
          })}
        />
      </div>
    </FormRow>
    ...
    )
  </Form>

}

// Specify the stlyle of the Image component
const Image = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 10px;
  border: 1px solid var(--color-grey-300);
  padding: 8px;
  border-radius: var(--border-radius-sm);
  display: block;
`;

```

/src/features/authentication/updateUserDataForm.jsx

```jsx
function UpdateUserDataForm() {
  const {
    user: {
      email,
      user_metadata: {
        fullName: currentFullName,
        avatar: currentAvatar = null,
      },
    } = {},
  } = useLoggedUser();

  ...

  const [avatarPreview, setAvatarPreview] = useState(currentAvatar);

  ...

  return (
    <Form onSubmit={handleSubmit} ref={formRef}>
      ...
      <FormRow label="Avatar image">
        <div>
          {(avatarPreview) && (
            <Image src={avatarPreview} defaultValue={avatarPreview} />
          )}
          <FileInput
            id="avatar"
            accept="image/*"
            onChange={(e) => setAvatar(createObjectURL(e.target.files[0]))}
            disabled={isUpdating}
          />
        </div>
      </FormRow>
      ...
    )
}

```
