<script lang="ts">
  import { Button, DarkMode, Dropdown, DropdownItem } from "flowbite-svelte";
  import ToggleTimezone from "./ToggleTimezone.svelte";
	import { IconSettings } from "@tabler/icons-svelte";
</script>

<Button color=alternative class="px-4 h-full">
  <IconSettings />
</Button>
<Dropdown placement="bottom-start">
  <DropdownItem>
    <DarkMode />
  </DropdownItem>
  <DropdownItem>
    <ToggleTimezone />
  </DropdownItem>
</Dropdown>
