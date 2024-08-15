import Spinner from '../../ui/Spinner';
import { useSettings } from './useSettings';
import { useUpdateSetting } from './useUpdateSetting';

import Form from '../../ui/Form';
import FormRow from '../../ui/FormRow';
import Input from '../../ui/Input';

function UpdateSettingsForm() {
  const { settings, isLoading } = useSettings();
  const { updateSetting, isUpdating } = useUpdateSetting();

  if (isLoading) return <Spinner />;

  const {
    min_booking_length,
    max_booking_length,
    max_guests_per_booking,
    breakfast_price,
  } = settings;

  function handleBlur(e, field) {
    const { value } = e.target;

    // console.log('handlelBlur', value);
    // console.log(`settings[field]`, settings[field], 'value', value);

    if (!value || settings[field] == value) return;

    updateSetting({ [field]: value });
  }

  // This time we are using UNCONTROLLED fields, so we will NOT store state
  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          defaultValue={min_booking_length}
          onBlur={(e) => handleBlur(e, 'min_booking_length')}
          /// When onChange is triggered focus to the element,
          /// because when we click on the up/down arrow it doesn't automatically focus
          /// therefor onBlur won't be triggered.
          onChange={(e) => e.target.focus()}
          disabled={isUpdating}
          id="min-nights"
        />
      </FormRow>
      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          defaultValue={max_booking_length}
          onBlur={(e) => handleBlur(e, 'max_booking_length')}
          onChange={(e) => e.target.focus()}
          disabled={isUpdating}
          id="max-nights"
        />
      </FormRow>
      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          defaultValue={max_guests_per_booking}
          onBlur={(e) => handleBlur(e, 'max_guests_per_booking')}
          onChange={(e) => e.target.focus()}
          disabled={isUpdating}
          id="max-guests"
        />
      </FormRow>
      <FormRow label="Breakfast price">
        <Input
          type="number"
          defaultValue={breakfast_price}
          onBlur={(e) => handleBlur(e, 'breakfast_price')}
          onChange={(e) => e.target.focus()}
          disabled={isUpdating}
          id="breakfast-price"
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
