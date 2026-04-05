import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group.tsx';
import { SearchIcon } from 'lucide-react';

// Define the interface for props
interface SearchbarProps {
  value: string;
  onChange: (val: string) => void;
}

export function Searchbar({ value, onChange }: SearchbarProps) {
  return (
    <InputGroup>
      <InputGroupInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon>
        <SearchIcon size={18} className="text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}