import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import Input from '../../ui/Input';
import Form from '../../ui/Form';
import Button from '../../ui/Button';
import FileInput from '../../ui/FileInput';
import Textarea from '../../ui/Textarea';
import { insertCabin } from '../../services/apiCabins';
import FormRow from '../../ui/FormRow';

CreateCabinForm.propTypes = {
  onInsertSuccess: PropTypes.func,
};

function CreateCabinForm({ onInsertSuccess }) {
  /// Beside register there is also reset to reset the form.
  const { register, handleSubmit, getValues, formState } = useForm();
  const { errors } = formState;
  console.log('errors', errors);
  const queryClient = useQueryClient();

  const { mutate: mutInsert, isLoading: isInserting } = useMutation({
    mutationFn: insertCabin,
    onSuccess: () => {
      toast.success(' A new cabin is successfully inserted');
      queryClient.invalidateQueries({
        queryKey: ['cabins'],
      });
      if (onInsertSuccess) onInsertSuccess();
    },
    onError: (err) => toast.error(err.message),
  });

  function onSubmit(data) {
    const newCabin = { ...data, image: data.image[0] };
    // console.log('onSubmit data', data);

    mutInsert(newCabin);
  }

  function onSubmitError(err) {
    /// This function is not too useful here, but we can use it for another purpose such as
    /// uploading the error to some logs.
    console.log('onSubmitError', err);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
      <FormRow label="Cabins name" errorMsg={errors?.name?.message}>
        <Input
          type="text"
          id="name"
          disabled={isInserting}
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
          type="number"
          id="maxCapacity"
          disabled={isInserting}
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
          type="number"
          id="regularPrice"
          disabled={isInserting}
          {...register('regular_price', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Discount" errorMsg={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isInserting}
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
          type="number"
          id="description"
          defaultValue=""
          disabled={isInserting}
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo" errorMsg={errors?.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isInserting}
          {...register('image', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" type="reset" disabled={isInserting}>
          Cancel
        </Button>
        <Button disabled={isInserting}>Add cabin</Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
