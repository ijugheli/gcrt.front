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
import { TreeCheckboxTable } from "./shared-components/tree-checkbox-table/tree-checkbox-table.component";
import { SkeletonModule } from "primeng/skeleton";
import { CaseSectionTable } from "./shared-components/case-section-table/case-section-table.component";
import { CaseSectionForm } from "./shared-components/case-section-form/case-section-form.component";
import { DialogModule } from 'primeng/dialog';
import { RouterModule } from "@angular/router";
import { CaseCheckboxSectionForm } from "./shared-components/case-checkbox-section-form/case-checkbox-section-form.component";
import { DropdownModule } from "primeng/dropdown";

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
        TreeCheckboxTable,
        CaseSectionTable,
        SkeletonModule,
        RouterModule,
        CaseCheckboxSectionForm,
        DropdownModule
    ]
})

export class CaseModule { }