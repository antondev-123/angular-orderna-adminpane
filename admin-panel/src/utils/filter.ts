import { FilterOption, FilterOptionGroup } from '../types/filter';

export function isGroup<T, K extends keyof T>(
  option: FilterOption<T, K>
): option is FilterOptionGroup<T, K> {
  return (
    typeof option === 'object' && 'groupName' in option && 'options' in option
  );
}

export function hasGroup<T, K extends keyof T>(
  options: FilterOption<T, K>[]
): boolean {
  return options.some((option) => isGroup(option));
}
