import { FormGroup } from "@angular/forms";

export const markFormGroupTouched = (formGroup: FormGroup) => {
  for (const i in formGroup.controls) {
    if (formGroup.controls.hasOwnProperty(i)) {
      formGroup.controls[i].markAsDirty();
      formGroup.controls[i].updateValueAndValidity();
    }
  }
}
export const numberWithCommas = (item: string) => {
  return item.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const cleanForm = (formGroup: FormGroup) => {
  Object.keys(formGroup.controls).forEach((key) => {
    if (typeof formGroup.get(key)?.value === 'string') {
      formGroup.get(key)?.setValue(formGroup.get(key)?.value.trim());
    }
  });
};

export const getCookie = (name: string): string | null => {
  const nameLenPlus = (name.length + 1);
  return document.cookie
    .split(';')
    .map(c => c.trim())
    .filter(cookie => {
      return cookie.substring(0, nameLenPlus) === `${name}=`;
    })
    .map(cookie => {
      return decodeURIComponent(cookie.substring(nameLenPlus));
    })[0] || null;
};