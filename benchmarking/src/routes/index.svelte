<script context="module">
  import { DEFAULT_DATA_SET } from "../config.js";
  export async function preload() {
    return this.redirect(302, `overview/${DEFAULT_DATA_SET}`);
  }
</script>
