import { AfterViewInit, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css'],
    providers: [LoadingService, MessagesService]
})
export class CourseDialogComponent implements AfterViewInit {

    form: FormGroup;

    course: Course;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course: Course, private coursesService: CoursesService,
        private loadingService: LoadingService, private messageService: MessagesService) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription, Validators.required]
        });

    }

    ngAfterViewInit() {

    }

    save() {
        const changes = this.form.value;
        const savedCourses$ = this.coursesService.saveCourse(this.course.id, changes).pipe(
            catchError((err) => {
                const message = "Could not save course";
                console.error(message, err)
                this.messageService.showErrors(message);
                return throwError(err);
            }
            )
        )
        const loadSavedCourses$ = this.loadingService.showLoaderUntilCompleted(savedCourses$);
        loadSavedCourses$.subscribe((value) => {
            this.dialogRef.close(value);
        })
    }

    close() {
        this.dialogRef.close();
    }

}
