import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { PieComponent } from '../../components/pie/pie.component';
import { PieDataModel } from '../../components/pie/pie.model';
import { ColorService } from '../../services/color.service';
import { PlayerService } from '../../services/player.service';
import { NurseryModel, WishListModel } from '../../models/nursery.model';
import { NurseryQueriesService } from '../../services/queries/nursery-queries.service';
import { switchMap } from 'rxjs';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'pm-nursery-wishlist-form',
  standalone: true,
  imports: [
    MatDialogModule,
    TranslateModule,
    MatInputModule,
    ReactiveFormsModule,
    NgForOf,
    PieComponent,
    NgClass,
    MatSliderModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './nursery-wishlist-form.component.html',
  styleUrls: ['./nursery-wishlist-form.component.scss'],
})
export class NurseryWishlistFormComponent implements OnInit {
  protected readonly typeNames: string[] = [
    'bug',
    'dark',
    'dragon',
    'electric',
    'fairy',
    'fighting',
    'fire',
    'flying',
    'ghost',
    'grass',
    'ground',
    'ice',
    'normal',
    'poison',
    'psy',
    'rock',
    'steel',
    'water',
  ];

  protected form: FormGroup<{
    quantity: FormControl<number>;
    typeRepartition: FormGroup;
  }>;

  protected pieData: PieDataModel[] = [];
  protected pieColors: string[] = [];
  protected nursery: NurseryModel;

  constructor(
    protected colorService: ColorService,
    protected playerService: PlayerService,
    protected nurseryQueriesService: NurseryQueriesService
  ) {}

  public ngOnInit(): void {
    this.playerService.player$
      .pipe(
        switchMap((player) => this.nurseryQueriesService.get(player.nursery))
      )
      .subscribe((nursery) => {
        this.nursery = nursery;
        this.initForm();
        this.initializeTypeSubscriptions();
        this.initializeFormValueChanges();
      });
  }

  protected calculateTotal(values: Record<string, number>): number {
    return this.typeNames.reduce((acc, type) => acc + values[type], 0);
  }

  protected initializeTypeSubscriptions(): void {
    for (const type of this.typeNames) {
      this.pieColors.push(this.colorService.getColorByType(type.toUpperCase()));

      this.getFormControl(type).valueChanges.subscribe(() => {
        const values =
          this.form.controls.typeRepartition.getRawValue() as Record<
            string,
            number
          >;
        const total = this.calculateTotal(values);

        if (total > 100) {
          this.substractNext(type, total - 100);
        }
      });
    }
  }

  protected initializeFormValueChanges(): void {
    this.updatePieData(this.form.controls.typeRepartition.getRawValue());
    this.form.controls.typeRepartition.valueChanges.subscribe(
      this.updatePieData
    );
  }

  protected updatePieData(value: unknown): void {
    const values = value as Record<string, number>;
    this.pieData = this.typeNames.map((type) => ({
      name: type.toUpperCase(),
      value: values[type] > 0 ? values[type] : null,
    }));
  }

  protected substractNext(type: string, value: number): void {
    let index = this.typeNames.findIndex((typeName) => typeName === type);
    if (index === this.typeNames.length - 1) {
      index = 0;
    } else {
      index += 1;
    }
    const formControl = this.getFormControl(this.typeNames[index]);
    if ((formControl.value ?? 0) - value < 0) {
      if (formControl.value > 0) {
        formControl.setValue(0);
      }
      this.substractNext(this.typeNames[index], value - formControl.value);
    } else {
      formControl.setValue(formControl.value - value);
    }
  }

  protected getFormControl(type: string): FormControl<number> {
    return this.form.controls.typeRepartition.get(type) as FormControl<number>;
  }

  protected initForm(): void {
    this.form = new FormGroup({
      quantity: new FormControl(this.nursery.wishList?.quantity, [
        Validators.max(this.nursery.level),
        Validators.required,
      ]),
      typeRepartition: new FormGroup(
        {
          bug: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.bug,
            [Validators.max(100), Validators.min(0)]
          ),
          dark: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.dark,
            [Validators.max(100), Validators.min(0)]
          ),
          dragon: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.dragon,
            [Validators.max(100), Validators.min(0)]
          ),
          electric: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.electric,
            [Validators.max(100), Validators.min(0)]
          ),
          fairy: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.fairy,
            [Validators.max(100), Validators.min(0)]
          ),
          fighting: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.fighting,
            [Validators.max(100), Validators.min(0)]
          ),
          fire: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.fire,
            [Validators.max(100), Validators.min(0)]
          ),
          flying: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.flying,
            [Validators.max(100), Validators.min(0)]
          ),
          ghost: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.ghost,
            [Validators.max(100), Validators.min(0)]
          ),
          grass: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.grass,
            [Validators.max(100), Validators.min(0)]
          ),
          ground: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.ground,
            [Validators.max(100), Validators.min(0)]
          ),
          ice: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.ice,
            [Validators.max(100), Validators.min(0)]
          ),
          normal: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.normal,
            [Validators.max(100), Validators.min(0)]
          ),
          poison: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.poison,
            [Validators.max(100), Validators.min(0)]
          ),
          psy: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.psy,
            [Validators.max(100), Validators.min(0)]
          ),
          rock: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.rock,
            [Validators.max(100), Validators.min(0)]
          ),
          steel: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.steel,
            [Validators.max(100), Validators.min(0)]
          ),
          water: new FormControl<number>(
            this.nursery.wishList?.typeRepartition?.water,
            [Validators.max(100), Validators.min(0)]
          ),
        },
        this.sumEquals100Validator()
      ),
    });
  }

  protected sumEquals100Validator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: unknown } | null => {
      const values = Object.values(
        (control as unknown as { controls: { value: number }[] }).controls
      ).map((ctrl) => ctrl.value || 0);
      const sum = values.reduce((acc, val) => acc + val, 0);
      return sum === 100 ? null : { sumNot100: true };
    };
  }

  protected submit(): void {
    this.nursery.wishList = this.form.getRawValue() as WishListModel;
    this.nurseryQueriesService
      .update(this.nursery, this.nursery._id)
      .subscribe();
  }
}
