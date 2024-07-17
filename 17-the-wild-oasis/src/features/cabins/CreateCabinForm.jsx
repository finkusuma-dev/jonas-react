import styled from 'styled-components';
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

const FormRow = styled.div`
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

CreateCabinForm.propTypes = {
  onInsertSuccess: PropTypes.func,
};

function CreateCabinForm({ onInsertSuccess }) {
  /// Beside register there is also reset to reset the form.
  const { register, handleSubmit, getValues } = useForm();
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
    console.log('onSubmit data', data);
    mutInsert(data);
  }

  function onSubmitError(err) {
    console.log('onSubmitError', err);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onSubmitError)}>
      <FormRow>
        <Label htmlFor="name">Cabin name</Label>
        <Input
          type="text"
          id="name"
          {...register('name', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="maxCapacity">Maximum capacity</Label>
        <Input
          type="number"
          id="maxCapacity"
          {...register('max_capacity', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Capacity must be at least 1',
            },
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="regularPrice">Regular price</Label>
        <Input
          type="number"
          id="regularPrice"
          {...register('regular_price', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="discount">Discount</Label>
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          {...register('discount', {
            required: 'This field is required',
            validate: (value) =>
              value <= getValues().regular_price ||
              'Discount must be less than regular price',
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="description">Description for website</Label>
        <Textarea
          type="number"
          id="description"
          defaultValue=""
          {...register('description', {
            required: 'This field is required',
          })}
        />
      </FormRow>

      <FormRow>
        <Label htmlFor="image">Cabin photo</Label>
        <FileInput id="image" accept="image/*" />
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
