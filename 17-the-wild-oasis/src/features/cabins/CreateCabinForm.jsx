import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import styled from 'styled-components';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import FormRow from '../../ui/FormRow';

import { useInsertCabin } from './useInsertCabin';
import { useUpdateCabin } from './useUpdateCabin';

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

const Image = styled.img`
  width: 200px;
  height: auto;
  margin-bottom: 10px;
  border: 1px solid var(--color-grey-300);
  padding: 8px;
  border-radius: var(--border-radius-sm);
  display: block;
`;

CreateCabinForm.propTypes = {
  onInsertUpdateSuccess: PropTypes.func,
  cabinToEdit: PropTypes.object,
};

function CreateCabinForm({ cabinToEdit, onInsertUpdateSuccess }) {
  /// Form Hooks

  /// Beside register there is also reset to reset the form.
  const isEdit = cabinToEdit !== null;
  const { register, handleSubmit, getValues, formState } = useForm({
    defaultValues: isEdit ? cabinToEdit : {},
  });

  // console.log('useForm getValues', getValues());
  const { errors } = formState;

  console.log('errors', errors);

  /// Query Hooks
  const { isInserting, insertCabin } = useInsertCabin();
  const { isUpdating, updateCabin } = useUpdateCabin();

  /// Other hook
  const [previewImgUrl, setPreviewImgUrl] = useState(null);

  const isBusy = isUpdating || isInserting;

  function onSubmit(data) {
    console.log('onSubmit', data);
    const newCabin = {
      ...data,
      image: typeof data.image === 'string' ? data.image : data.image[0],
    };
    if (isEdit) {
      updateCabin(
        { cabin: newCabin, cabinId: data?.id ?? null },
        {
          onSuccess: () => onInsertUpdateSuccess && onInsertUpdateSuccess(),
        }
      );
    } else {
      // console.log('onSubmit data', data);

      insertCabin(newCabin, {
        onSuccess: () => onInsertUpdateSuccess && onInsertUpdateSuccess(),
      });
    }
  }

  function onSubmitError(/* err */) {
    /// This function is not too useful here, but we can use it for another purpose such as
    /// uploading the error to some logs.
    // console.log('onSubmitError', err);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
      <FormRow label="Cabins name" errorMsg={errors?.name?.message}>
        <Input
          id="name"
          type="text"
          // defaultValue={cabinToEdit?.name}
          disabled={isBusy}
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow
        label="Maximum capacity"
        errorMsg={errors?.max_capacity?.message}
      >
        <Input
          id="maxCapacity"
          type="number"
          // defaultValue={cabinToEdit?.max_capacity}
          disabled={isBusy}
          {...register('max_capacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity must be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" errorMsg={errors?.regular_price?.message}>
        <Input
          id="regularPrice"
          type="number"
          // defaultValue={cabinToEdit?.regular_price}
          disabled={isBusy}
          {...register('regular_price', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Discount" errorMsg={errors?.discount?.message}>
        <Input
          id="discount"
          type="number"
          defaultValue={0}
          disabled={isBusy}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              Number.parseFloat(value) <=
                Number.parseFloat(getValues().regular_price) ||
              'Discount must be less or equal than regular price',
          })}
        />
      </FormRow>

      <FormRow label="Description" errorMsg={errors?.description?.message}>
        <Textarea
          id="description"
          type="number"
          defaultValue={''}
          disabled={isBusy}
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <StyledFormRow>
        <Label for="image">Cabin photo</Label>
        <div>
          {(previewImgUrl || cabinToEdit?.image) && (
            <Image
              src={previewImgUrl || cabinToEdit?.image}
              defaultValue={cabinToEdit?.image}
            />
          )}

          <FileInput
            id="image"
            accept="image/*"
            disabled={isBusy}
            {...register('image', {
              required: isEdit ? false : 'This field is required',
              onChange: (e) => {
                /// Preview selected image
                // console.log('url', URL.createObjectURL(e.target.files[0]));
                setPreviewImgUrl(URL.createObjectURL(e.target.files[0]));
              },
            })}
          />
        </div>
        {errors?.image?.message && <Error>{errors?.image?.message}</Error>}
      </StyledFormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        {!isEdit && (
          <Button variation="secondary" type="reset" disabled={isBusy}>
            Cancel
          </Button>
        )}
        <Button disabled={isBusy}>{isEdit ? 'Save' : 'Add cabin'}</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
