<script context="module">
  import configuration from "../configuration.js";
  export async function preload() {
    return this.redirect(302, `overview/${configuration.DEFAULT_DATA_SET}`);
  }
</script>
