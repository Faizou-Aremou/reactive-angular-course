import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course, sortCoursesBySeqNo } from "../model/course";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
//service statefull, service facade, viewModel, modelClass
export class CoursesStore {
  courses$: Observable<Course[]>;


  // you can have only one way to be notified by new data. 
  // thus this function can return instead void and use subject to provide courses data. 
  filterByCategory(category: string): Observable<Course[]> {
    return this.courses$.pipe(
      map(courses => courses.filter(course => course.category === category).sort(sortCoursesBySeqNo)
      )
    )
  }

}