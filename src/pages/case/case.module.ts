import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DividerModule } from "primeng/divider";
import { InputMaskModule } from "primeng/inputmask";
import { KeyFilterModule } from "primeng/keyfilter";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { CaseFormComponent } from "./case-form/case-form.component";
import { CaseComponent } from "./case.component";
import { CustomInputComponent } from "../client/custom-input/custom-input.component";
import { CheckboxModule } from "primeng/checkbox";

@NgModule({
    declarations: [CaseComponent, CaseFormComponent],
    imports: [
        ButtonModule,
        CommonModule,
        ConfirmDialogModule,
        DividerModule,
        InputMaskModule,
        ToastModule,
        CustomInputComponent,
        CheckboxModule,
        TableModule,
        SelectButtonModule,
        FormsModule,
        KeyFilterModule
    ]
})

export class CaseModule { }