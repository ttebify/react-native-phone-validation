import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Alert, Button, StyleSheet, View } from "react-native";
import { parsePhoneNumber } from "libphonenumber-js/min";
import * as Yup from "yup";
import { PhoneInput } from "./PhoneInput";

function validPhone(phone) {
  if (phone == null || phone[0] == null || phone[1] == null) {
    return false;
  }
  const countryCode = phone[1];
  try {
    const parsed = parsePhoneNumber(phone[0], countryCode);
    if (parsed == null) {
      return false;
    }
    return parsed.isValid();
  } catch {
    return false;
  }
}

function phoneNotEmpty(phone) {
  return phone != null && !!phone[0] && !!phone[1];
}

function formatPhone(phone, countryCode) {
  try {
    const phoneNumber = parsePhoneNumber(phone, countryCode);
    return phoneNumber?.formatInternational();
  } catch (err) {
    return "";
  }
}

const phoneValidation = Yup.array()
  .of(Yup.string())
  .test("valid phone", "Invalid phone number", validPhone)
  .test("valid phone", "Phone number is required", phoneNotEmpty);

const ValidationSchema = Yup.object().shape({
  phone: phoneValidation,
});

const initialValues = {
  phone: ["", "NG"],
};

export default function App() {
  const [countryCode, setCountryCode] = useState("NG");
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  const handleAccountUpdate = async () => {
    try {
      // Validate the form
      await ValidationSchema.validate(formValues, { abortEarly: false });

      console.log("Form values:", formValues);

      const formatedValues = {
        ...formValues,
        phone: formatPhone(formValues.phone[0], countryCode),
      };

      Alert.alert(
        "Success",
        "The phone number: " + formatedValues.phone + " will be submitted"
      );
      // Proceed to submit the data to the server for further processing
    } catch (validationErrors) {
      // Handle validation errors
      console.log(validationErrors);
      const errors = {};
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setFormErrors(errors);
    }
  };

  const handleChangeCountry = (country) => {
    setCountryCode(country.cca2);
  };

  const handleChangePhone = (phone) => {
    setFormValues({
      ...formValues,
      phone: [phone, countryCode],
    });
    // Clear the corresponding phone error when the phone value changes
    setFormErrors({
      ...formErrors,
      phone: undefined,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <PhoneInput
        label="Phone"
        placeholder="Enter Phone"
        phone={formValues.phone[0]}
        onChangePhone={handleChangePhone}
        countryCode={countryCode}
        onChangeCountry={handleChangeCountry}
        error={Boolean(formErrors.phone)}
        errorMessage={formErrors.phone}
        preferredCountries={["NG"]}
        clearErrorMessage={() =>
          setFormErrors({ ...formErrors, phone: undefined })
        }
        style={undefined}
        outlineStyle={undefined}
      />
      <Button title="Submit" onPress={handleAccountUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    padding: 10,
    maxWidth: 600,
  },
});
