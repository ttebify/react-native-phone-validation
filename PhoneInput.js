import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import CountryPicker from "react-native-country-picker-modal";

export function PhoneInput({
  countryCode,
  phone,
  onChangeCountry,
  onChangePhone,
  preferredCountries,
  error: hasError = false,
  label,
  errorMessage = "",
  ...wrapperProps
}) {
  const handleChangeCountry = (country) => {
    onChangeCountry(country);
    wrapperProps.clearErrorMessage?.();
  };

  const handleChangeText = (value) => {
    onChangePhone(value);
    wrapperProps.clearErrorMessage?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <CountryPicker
          containerButtonStyle={[
            styles.countryPickerButton,
            hasError && styles.errorBorder,
          ]}
          countryCode={countryCode}
          withCallingCode
          withCallingCodeButton
          withFilter
          preferredCountries={preferredCountries}
          onSelect={handleChangeCountry}
        />
        <TextInput
          style={[styles.textInput, hasError && styles.errorInput]}
          keyboardType="phone-pad"
          autoCorrect={false}
          autoComplete="tel"
          textContentType="telephoneNumber"
          onChangeText={handleChangeText}
          value={phone}
          placeholder="Enter Phone"
          placeholderTextColor="#A0A0A0"
        />
      </View>
      {hasError && errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: "#333",
    fontSize: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  countryPickerButton: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#A0A0A0",
    marginRight: 8,
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  errorBorder: {
    borderColor: "#FF0000",
  },
  textInput: {
    backgroundColor: "#FFF",
    borderColor: "#A0A0A0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    color: "#333",
    flex: 1,
  },
  errorInput: {
    borderColor: "#FF0000",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 14,
    marginTop: 4,
  },
});
