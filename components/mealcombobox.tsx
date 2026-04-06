"use client";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const mealOptions = ["Breakfast", "Lunch", "Dinner"] as const;

export function MealCombobox() {
  return (
    <Combobox items={mealOptions}>
      <ComboboxInput placeholder="Select a meal" />
      <ComboboxContent>
        <ComboboxEmpty>No meal options found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
