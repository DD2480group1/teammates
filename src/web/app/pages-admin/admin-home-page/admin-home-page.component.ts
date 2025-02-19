import { Component } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { AccountService } from '../../../services/account.service';
import { JoinLink } from '../../../types/api-output';
import { ErrorMessageOutput } from '../../error-message-output';
import { InstructorData } from './instructor-data';

/**
 * Admin home page.
 */
@Component({
  selector: 'tm-admin-home-page',
  templateUrl: './admin-home-page.component.html',
  styleUrls: ['./admin-home-page.component.scss'],
})
export class AdminHomePageComponent {

  instructorDetails: string = '';
  instructorName: string = '';
  instructorEmail: string = '';
  instructorInstitution: string = '';

  instructorsConsolidated: InstructorData[] = [];
  activeRequests: number = 0;

  isAddingInstructors: boolean = false;

  constructor(private accountService: AccountService) {}

  /**
   * Validates and adds the instructor details filled with first form.
   */
  validateAndAddInstructorDetails(): void {
    const invalidLines: string[] = [];
    for (const instructorDetail of this.instructorDetails.split(/\r?\n/)) {
      const instructorDetailSplit: string[] = instructorDetail.split(/[|\t]/).map((item: string) => item.trim());
      if (instructorDetailSplit.length < 3) {
        // TODO handle error
        invalidLines.push(instructorDetail);
        continue;
      }
      if (!instructorDetailSplit[0] || !instructorDetailSplit[1] || !instructorDetailSplit[2]) {
        // TODO handle error
        invalidLines.push(instructorDetail);
        continue;
      }
      this.instructorsConsolidated.push({
        name: instructorDetailSplit[0],
        email: instructorDetailSplit[1],
        institution: instructorDetailSplit[2],
        status: 'PENDING',
        isCurrentlyBeingEdited: false,
      });
    }
    this.instructorDetails = invalidLines.join('\r\n');
  }

  /**
   * Validates and adds the instructor detail filled with second form.
   */
  validateAndAddInstructorDetail(): void {
    if (!this.instructorName || !this.instructorEmail || !this.instructorInstitution) {
      // TODO handle error
      return;
    }
    this.instructorsConsolidated.push({
      name: this.instructorName,
      email: this.instructorEmail,
      institution: this.instructorInstitution,
      status: 'PENDING',
      isCurrentlyBeingEdited: false,
    });
    this.instructorName = '';
    this.instructorEmail = '';
    this.instructorInstitution = '';
  }

  /**
   * Adds the instructor at the i-th index.
   */
  addInstructor(i: number): void {
    const instructor: InstructorData = this.instructorsConsolidated[i];
    if (this.instructorsConsolidated[i].isCurrentlyBeingEdited
      || (instructor.status !== 'PENDING' && instructor.status !== 'FAIL')) {
      return;
    }
    this.activeRequests += 1;
    instructor.status = 'ADDING';

    this.isAddingInstructors = true;
    this.accountService.createAccountRequest({
      instructorEmail: instructor.email,
      instructorName: instructor.name,
      instructorInstitution: instructor.institution,
    })
        .pipe(finalize(() => {
          this.isAddingInstructors = false;
        }))
        .subscribe((resp: JoinLink) => {
          instructor.status = 'SUCCESS';
          instructor.joinLink = resp.joinLink;
          this.activeRequests -= 1;
        }, (resp: ErrorMessageOutput) => {
          instructor.status = 'FAIL';
          instructor.message = resp.error.message;
          this.activeRequests -= 1;
        });
  }

  /**
   * Removes the instructor at the i-th index.
   */
  removeInstructor(i: number): void {
    this.instructorsConsolidated.splice(i, 1);
  }

  /**
   * Sets the i-th instructor data row's edit mode status.
   *
   * @param i The index.
   * @param isEnabled Whether the edit mode status is enabled.
   */
  setInstructorRowEditModeEnabled(i: number, isEnabled: boolean): void {
    this.instructorsConsolidated[i].isCurrentlyBeingEdited = isEnabled;
  }

  /**
   * Adds all the pending and failed-to-add instructors.
   */
  addAllInstructors(): void {
    for (let i: number = 0; i < this.instructorsConsolidated.length; i += 1) {
      this.addInstructor(i);
    }
  }

}
