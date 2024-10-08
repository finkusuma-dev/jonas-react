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

const Image = styled.img`
  width: 150px;
  height: auto;
  margin-bottom: 10px;
  border: 1px solid var(--color-grey-300);
  padding: 8px;
  border-radius: var(--border-radius-sm);
  display: block;
`;

CreateCabinForm.propTypes = {
  onCloseModal: PropTypes.func,
  cabinToEdit: PropTypes.object,
};

function CreateCabinForm({ cabinToEdit, onCloseModal }) {
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
  const [imagePreview, setImagePreview] = useState(cabinToEdit?.image);

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
          onSuccess: () => onCloseModal?.(),
        }
      );
    } else {
      // console.log('onSubmit data', data);

      insertCabin(newCabin, {
        onSuccess: () => onCloseModal?.(),
      });
    }
  }

  function onSubmitError(/* err */) {
    /// This function is not too useful here, but we can use it for another purpose such as
    /// uploading the error to some logs.
    // console.log('onSubmitError', err);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onSubmitError)} type="modal">
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

      <FormRow label="Maximum capacity" errorMsg={errors?.maxCapacity?.message}>
        <Input
          id="maxCapacity"
          type="number"
          // defaultValue={cabinToEdit?.maxCapacity}
          disabled={isBusy}
          {...register('maxCapacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity must be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular price" errorMsg={errors?.regularPrice?.message}>
        <Input
          id="regularPrice"
          type="number"
          // defaultValue={cabinToEdit?.regularPrice}
          disabled={isBusy}
          {...register('regularPrice', {
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
                Number.parseFloat(getValues().regularPrice) ||
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

      <FormRow label="Description" errorMsg={errors?.description?.message}>
        <div>
          {imagePreview && (
            <Image src={imagePreview} defaultValue={imagePreview} />
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
                setImagePreview(URL.createObjectURL(e.target.files[0]));
              },
            })}
          />
        </div>
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}

        <Button
          className="formButton"
          variation="secondary"
          type="reset"
          disabled={isBusy}
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>

        <Button className="formButton" disabled={isBusy}>
          {isEdit ? 'Save' : 'Add cabin'}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
