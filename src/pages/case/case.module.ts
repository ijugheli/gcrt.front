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
import { CheckboxTable } from "./shared-components/checkbox-table/checkbox-table.component";
import { SkeletonModule } from "primeng/skeleton";
import { CaseSectionTable } from "./shared-components/case-section-table/case-section-table.component";
import { CaseSectionForm } from "./shared-components/case-section-form/case-section-form.component";
import { DialogModule } from 'primeng/dialog';

@NgModule({
    declarations: [CaseComponent, CaseFormComponent],
    imports: [
        ButtonModule,
        CommonModule,
        DialogModule,
        ConfirmDialogModule,
        DividerModule,
        InputMaskModule,
        ToastModule,
        CustomInputComponent,
        CaseSectionForm,
        CheckboxModule,
        TableModule,
        SelectButtonModule,
        FormsModule,
        KeyFilterModule,
        CheckboxTable,
        CaseSectionTable,
        SkeletonModule,
    ]
})

export class CaseModule { }