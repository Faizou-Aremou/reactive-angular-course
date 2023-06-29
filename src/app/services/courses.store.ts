import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { catchError, map, tap } from "rxjs/operators";
import { LoadingService } from "../loading/loading.service";
import { MessagesService } from "../messages/messages.service";
import { CoursesService } from "./courses.service";

@Injectable({
  providedIn: 'root'
})
//service statefull, service facade, viewModel, modelClass
export class CoursesStore {
  private subject = new BehaviorSubject<Course[]>([]);

  courses$: Observable<Course[]> = this.subject.asObservable();

  constructor(private coursesService: CoursesService, private loading: LoadingService, private messages: MessagesService) {
    this.loadAllCourses();
  }

  // you can have only one way to be notified by new data. 
  // thus this function can return instead void and use subject to provide courses data. 
  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category === category).sort(sortCoursesBySeqNo)
      )
    )
  }

  private loadAllCourses() {
    const loadCourses$ = this.coursesService.loadAllCourses().pipe(
      catchError(err => {
        const message = "Could not not load courses";
        this.messages.showErrors(message);
        console.error(message, err);
        return throwError(err);
      }),
      tap(courses => this.subject.next(courses))
    );
    this.loading.showLoaderUntilCompleted(loadCourses$).subscribe();
  }

}