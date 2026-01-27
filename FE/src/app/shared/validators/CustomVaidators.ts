import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomVaidators {
    public static passwordComplexityValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            if (!value) return null;

            const errors: string[] = [];
            if (!/[A-Z]/.test(value)) {
                errors.push('uppercase');
            }
            if (!/[a-z]/.test(value)) {
                errors.push('lowercase');
            }
            if (!/[0-9]/.test(value)) {
                errors.push('number');
            }
            if (!/[!@#$%^&*(),.?":{}|<>_\-\\/~`+=;']/g.test(value)) {
                errors.push('special');
            }
            return errors.length > 0 ? { passwordComplexity: errors } : null;
        };
    }
    public static noSpaceValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value || '';
            return /\s/.test(value) ? { noSpace: true } : null;
        };
    }


    public static removeSpaces(control: AbstractControl) {
        if (control && control.value && !control.value.replace(/\s+/g, '').length) {
            control.setValue(null);
            control.value.trim();
        }
        return null;
    }
    public static NoWhiteSpaceValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return {};
            }
            // value truyền vào
            return (control.value || '').trim().length === 0 ? { whitespace: true } : {};
        };
    }
    public static checkFromDate2(filed: string, fromDatev: string, toDateV: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return {};
            }
            switch (filed) {
                case fromDatev: {
                    if (control?.parent?.value[toDateV]) {
                        const fromDate = new Date(control.value);
                        const toDate = new Date(control?.parent?.value[toDateV]);
                        return +fromDate - +toDate > 0 ? { fromdate: true } : {};
                    }
                    return {};
                }
                case toDateV: {
                    if (control?.parent?.value[fromDatev]) {
                        const toDate = new Date(control.value);
                        const fromDate = new Date(control?.parent?.value[fromDatev]);
                        return +fromDate - +toDate > 0 ? { todate: true } : {};
                    }
                    return {};
                }
            }
            // value truyền vào
            return {};
        };
    }

    public static checkMustHaveTwo(filed: string, fromDatev: string, toDateV: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return {};
            }
            switch (filed) {
                case fromDatev: {
                    if (control.value && !control?.parent?.value[toDateV]) {
                        return { musthave: true };
                    }
                    if (control.value && control?.parent?.value[toDateV]) {
                        control?.parent?.get(toDateV)?.setErrors(null);
                        control.setErrors(null);
                    }
                    return {};
                    // return control.value && !control?.parent?.value[toDateV] ? { musthave: true } : {};
                }
                case toDateV: {
                    if (control.value && !control?.parent?.value[fromDatev]) {
                        return { musthave: true };
                    }
                    if (control.value && control?.parent?.value[fromDatev]) {
                        control?.parent?.get(fromDatev)?.setErrors(null);
                        control.setErrors(null);
                    }
                    return {};
                }
            }
            // value truyền vào
            return {};
        };
    }

    public static Max100(filed1: string, filed2: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return {};
            }
            if (+control.value + +control?.parent?.value[filed1] + +control?.parent?.value[filed2] > 100) {
                return { max100: true };
            }

            // value truyền vào
            return {};
        };
    }

    public static CheckPlantationFieldsCoordinates(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return {};
            }
            // value truyền vào
            return !Array.isArray(JSON.parse(control.value)) || JSON.parse(control.value).length !== 2 ? { plantationfieldscoordinates: true } : {};
        };
    }
    public static CheckIsNumber(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return {};
            }
            return isNaN(+control.value) ? { isnumber: true } : {};
        };
    }
    public static EmailValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return {};
            }
            // value truyền vào
            const email = (control.value || '').toLowerCase();
            if (!email.endsWith('@gmail.com')) {
                return { invalidEmail: true }; // Lỗi nếu không kết thúc bằng '@gmail.com'
            }
            return {};
        };
    }
    public static CheckPassWord(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (control?.parent?.value?.new_password !== control.value) {
                return { confirm_password: true };
            } else {
                return {};
            }
        };
    }
    public static checkFromDate(filed: string, fromDatev: string, toDateV: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return {};
            }
            switch (filed) {
                case fromDatev: {
                    if (control?.parent?.value[toDateV]) {
                        const fromDate = new Date(control.value);
                        const toDate = new Date(control?.parent?.value[toDateV]);
                        return +fromDate - +toDate > 0 ? { fromdate: true } : {};
                    }
                    return {};
                }
                case toDateV: {
                    if (control?.parent?.value[fromDatev]) {
                        const toDate = new Date(control.value);
                        const fromDate = new Date(control?.parent?.value[fromDatev]);
                        return +fromDate - +toDate > 0 ? { todate: true } : {};
                    }
                    return {};
                }
            }
            // value truyền vào
            return {};
        };
    }

    public static ConfirmMatchValidator(matchingControl: AbstractControl): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (matchingControl && matchingControl.errors && !matchingControl.errors['confirmMatchValidator']) {
                return {};
            }
            if (control.value !== matchingControl.value) {
                return { mustMatch: true };
            } else {
                return {};
            }
        };
    }

    public static ArrayColorsValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let check = true;
            if (control.value) {
                const value = [...control.value];
                value.forEach((val) => {
                    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(String(val)) === false) {
                        check = false;
                    }
                });
                if (check) {
                } else {
                    return { colors: false };
                }
            }

            if (control.value || check) {
                const value = [...control.value];
                value.forEach((val) => {
                    if (value.filter((x) => x === val).length >= 2) {
                        check = false;
                    }
                });
            }
            return check ? null : { colors: true };
        };
    }

    public static SVGImgValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            // value truyền vào
            const check = (control.value || '').trim().length < 1 || !control.value.match(/\@[a-z0-9]{0,25}\@/g);
            return check ? { imgKeyEmpty: true } : {};
        };
    }

    public static bindingCompareValidator(lControlName: string, rControlName: string) {
        return (formGroup: FormGroup) => {
            const lControl = formGroup.controls[lControlName];
            const rControl = formGroup.controls[rControlName];
            if (rControl.errors && !rControl.errors['binding']) {
                return;
            }
            if (+lControl.value >= +rControl.value) {
                lControl.setErrors({ binding: true });
                rControl.setErrors({ binding: true });
            } else {
                rControl.setErrors(null);
                lControl.setErrors(null);
            }
        };
    }

    public static dateCompareValidator(lControlName: string, rControlName: string) {
        return (formGroup: FormGroup) => {
            const lControl = formGroup.controls[lControlName];
            const rControl = formGroup.controls[rControlName];
            if (rControl.errors && !rControl.errors['binding']) {
                return;
            }
            const lValue = lControl.value as Date;
            const rValue = rControl.value as Date;
            if (lValue.getTime() > rValue.getTime()) {
                lControl.setErrors({ binding: true });
                rControl.setErrors({ binding: true });
            } else {
                rControl.setErrors(null);
                lControl.setErrors(null);
            }
        };
    }

    public static chipsDuplicate(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            // value truyền vào
            if (!control.value || control.value.length < 2) {
                return {};
            }
            return new Set(control.value).size !== control.value.length ? { duplicate: true } : {};
        };
    }
    public static chipsPattern(pattern: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            // value truyền vào
            if (control.value && control.value.length > 0) {
                for (let el of control.value) {
                    if (!el.match(pattern)) {
                        return { pattern: true };
                    }
                }
            }
            return {};
        };
    }
}
