import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { DividerModule } from "primeng/divider";
import { DropdownModule } from "primeng/dropdown";
import { InputMaskModule } from "primeng/inputmask";
import { InputSwitchModule } from "primeng/inputswitch";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { KeyFilterModule } from "primeng/keyfilter";
import { SelectButtonModule } from "primeng/selectbutton";
import { TableModule } from "primeng/table";
import { ToastModule } from "primeng/toast";
import { TreeSelectModule } from "primeng/treeselect";
import { CaseFormComponent } from "./case-form/case-form.component";
import { CaseComponent } from "./case.component";

@NgModule({
    declarations: [CaseComponent, CaseFormComponent],
    imports: [
        ButtonModule,
        CalendarModule,
        CommonModule,
        ConfirmDialogModule,
        DropdownModule,
        DividerModule,
        InputSwitchModule,
        InputMaskModule,
        InputTextModule,
        InputTextareaModule,
        ToastModule,
        TableModule,
        TreeSelectModule,
        SelectButtonModule,
        FormsModule,
        KeyFilterModule
    ]
})

export class CaseModule { }