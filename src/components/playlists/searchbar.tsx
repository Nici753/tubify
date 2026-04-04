import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group.tsx'
import { SearchIcon } from 'lucide-react';

export function Searchbar() {

  return (
    <InputGroup >
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}