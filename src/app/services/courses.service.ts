import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { catchError, map, shareReplay, take } from "rxjs/operators";
import { Course } from "../model/course";

@Injectable({ providedIn: "root" })
export class CoursesService {
  constructor(private http: HttpClient) {}

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<any>("api/courses").pipe(
      map((res) => res.payload as Course[]),
      shareReplay()
    );
  }

  saveCourse(courseId: string, changes: Partial<Course>): Observable<any> {
    return this.http
      .put<any>(`/api/courses/${courseId}`, changes)
      .pipe(take(1));
  }
}
