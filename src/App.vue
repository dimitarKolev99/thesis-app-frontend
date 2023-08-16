<template>
  <q-layout
    view="hHh lpR fFf"
    style="min-height: 100vh; display: flex; flex-direction: column"
  >
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <r-tabs align="left" style="align-items: flex-start !important">
        <r-route-tab
          to="/overview"
          class="text-white"
          label="License Overview"
        />
        <r-route-tab :to="getRoute" class="text-white" label="Get A License File" />
        <r-tab
          class="text-white"
          label="Help"
          @click="helpDialogOpen = !helpDialogOpen"
        />
      </r-tabs>
    </q-header>

    <q-page-container style="flex-grow: 1; overflow-y: auto">
      <div class="layout-view" style="margin-top: 2rem">
        <router-view v-slot="{ Component }">
          <transition name="q-transition--slide-left">
            <component
              @chosenFlow="handleChosenFlow"
              :is="Component"
              :key="$route.path"
            />
          </transition>
        </router-view>
      </div>
    </q-page-container>

    <q-footer
      elevated
      class="text-white"
      style="margin-top: 2rem; margin-bottom: 2rem"
    >
      <div class="row" style="height: 100%; gap: 1rem; justify-content: center">
        <r-btn label="Legal Notice" @click="dialogOpen = !dialogOpen" outline />
        <r-btn
          label="Privacy Policy"
          @click="dialogOpen = !dialogOpen"
          outline
        />
        <r-btn label="Terms of use" @click="dialogOpen = !dialogOpen" outline />
        <r-btn
          label="License Conditions"
          @click="dialogOpen = !dialogOpen"
          outline
        />
        <r-btn
          label="Software Licenses"
          @click="dialogOpen = !dialogOpen"
          outline
        />
      </div>

      <r-dialog v-model="helpDialogOpen">
        <r-card style="padding: 0">
          <r-card-section style="padding: 0">
            <div
              style="
                display: flex;
                flex-direction: row;
                justify-content: center;
                align-items: center;
                gap: 1rem;
              "
            >
              <r-tab-panels
                v-model="tab"
                animated
                class="shadow-2 rounded-borders"
              >
                <r-tab-panel name="first" style="overflow: hidden; padding: 0">
                  <div class="column" style="padding: 2rem">
                    <div style="width: 100%; height: 5rem">
                      <r-btn
                        outline
                        label="I've lost my license"
                        style="width: 95%"
                        @click="toHelpRouting(0)"
                      />
                    </div>
                    <div style="width: 100%; height: 5rem">
                      <r-btn
                        outline
                        label="I've entered wrong appliance serial number(s)"
                        style="width: 95%"
                        @click="toHelpRouting(1)"
                      />
                    </div>
                    <div style="width: 100%; height: 5rem">
                      <r-btn
                        outline
                        label="I want to license more appliances"
                        to="/voucher"
                        style="width: 95%"
                      />
                    </div>
                    <div style="width: 100%; height: 5rem">
                      <r-btn
                        outline
                        label="General FAQ"
                        style="width: 95%"
                        @click="toHelpRouting(3)"
                      />
                    </div>
                    <div style="width: 100%; height: 5rem">
                      <r-btn
                        outline
                        label="Contact support"
                        style="width: 95%"
                        @click="toHelpRouting(4)"
                      />
                    </div>
                  </div>
                </r-tab-panel>
                <r-tab-panel
                  name="second"
                  style="height: 545px; overflow: hidden"
                >
                  <div class="text-h6">Your appliances's serial number</div>
                  <p style="text-align: left">
                    The serial number consists of 4 numbers that are separated
                    by
                    <strong>.</strong>
                  </p>
                  <p style="text-align: left; margin-bottom: 1rem">
                    Usually it is placed in the top part of the fridge, as shown
                    in the picture below.
                  </p>
                  <img width="300" src="/ApplianceSN.png" />
                </r-tab-panel>
              </r-tab-panels>
            </div>
          </r-card-section>

          <!-- <r-card-actions style="margin: 0"> </r-card-actions> -->
        </r-card>
      </r-dialog>

      <r-dialog v-model="dialogOpen">
        <r-card>
          <r-card-section>
            <p class="terms">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              vitae facilisis urna. Maecenas vitae felis eu nisi pharetra
              auctor. Nunc accumsan ac leo sed aliquet. Sed vel risus sapien.
              Quisque eu arcu nunc. Etiam pellentesque quis nibh et volutpat.
              Phasellus finibus eros in arcu pretium faucibus. Donec euismod
              sapien a porttitor commodo. Praesent tristique faucibus efficitur.
              Donec auctor consequat purus ut ullamcorper. Aliquam molestie
              finibus odio in imperdiet. Nullam molestie auctor justo, vitae
              vulputate augue volutpat a. In nulla mauris, suscipit ac venenatis
              non, sodales eget libero. Curabitur tristique, lacus tincidunt
              accumsan tempor, leo enim posuere diam, quis condimentum nibh nibh
              egestas sapien. Aliquam quis dolor faucibus diam dictum ornare a
              sed purus. Maecenas ac lorem vel nisi molestie finibus. Sed
              molestie nulla eu augue porta, quis pellentesque elit egestas.
              Praesent sit amet sapien ac urna pharetra rhoncus id sed lorem.
              Pellentesque sollicitudin sit amet est gravida tincidunt. Integer
              vulputate congue pellentesque.
            </p>
          </r-card-section>
          <r-card-actions
            style="
              margin: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            "
          >
            <r-btn
              label="Agree"
              color="primary"
              @click="dialogOpen = !dialogOpen"
            />
          </r-card-actions>
        </r-card>
      </r-dialog>
    </q-footer>
  </q-layout>

  <!-- <div class="container">
    <router-view v-slot="{ Component }">
      <transition name="q-transition--slide-left">
        <component :is="Component" :key="$route.path" />
      </transition>
    </router-view>

    <div class="row" style="height: 100%; gap: 1rem; justify-content: center">
      <r-btn label="Legal Notice" @click="dialogOpen = !dialogOpen" outline />
      <r-btn label="Privacy Policy" @click="dialogOpen = !dialogOpen" outline />
      <r-btn label="Terms of use" @click="dialogOpen = !dialogOpen" outline />
      <r-btn
        label="License Conditions"
        @click="dialogOpen = !dialogOpen"
        outline
      />
      <r-btn
        label="Software Licenses"
        @click="dialogOpen = !dialogOpen"
        outline
      />
      <r-btn
        color="primary"
        @click="helpDialogOpen = !helpDialogOpen"
        icon="lh:question-mark"
      />
    </div>

    <r-dialog v-model="helpDialogOpen">
      <r-card style="padding: 0">
        <r-card-section style="padding: 0">
          <div
            style="
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              gap: 1rem;
            "
          >
            <r-tab-panels
              v-model="tab"
              animated
              class="shadow-2 rounded-borders"
            >
              <r-tab-panel name="first" style="overflow: hidden; padding: 0">
                <div class="column" style="padding: 2rem">
                  <div style="width: 100%; height: 5rem">
                    <r-btn
                      outline
                      label="I've lost my license"
                      style="width: 95%"
                    />
                  </div>
                  <div style="width: 100%; height: 5rem">
                    <r-btn
                      outline
                      label="I've entered wrong appliance serial number(s)"
                      style="width: 95%"
                    />
                  </div>
                  <div style="width: 100%; height: 5rem">
                    <r-btn
                      outline
                      label="I want to license more appliances"
                      to="/multiple-appliances"
                      style="width: 95%"
                    />
                  </div>
                  <div style="width: 100%; height: 5rem">
                    <r-btn outline label="General FAQ" style="width: 95%" />
                  </div>
                  <div style="width: 100%; height: 5rem">
                    <r-btn outline label="Contact support" style="width: 95%" />
                  </div>
                </div>
              </r-tab-panel>
              <r-tab-panel
                name="second"
                style="height: 545px; overflow: hidden"
              >
                <div class="text-h6">Your appliances's serial number</div>
                <p style="text-align: left">
                  The serial number consists of 4 numbers that are separated by
                  <strong>.</strong>
                </p>
                <p style="text-align: left; margin-bottom: 1rem">
                  Usually it is placed in the top part of the fridge, as shown
                  in the picture below.
                </p>
                <img width="300" src="src/assets/ApplianceSN.png" />
              </r-tab-panel>
            </r-tab-panels>
          </div>
        </r-card-section>

         <r-card-actions style="margin: 0"> </r-card-actions> 
      </r-card>
    </r-dialog>

    <r-dialog v-model="dialogOpen">
      <r-card>
        <r-card-section>
          <p class="terms">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
            vitae facilisis urna. Maecenas vitae felis eu nisi pharetra auctor.
            Nunc accumsan ac leo sed aliquet. Sed vel risus sapien. Quisque eu
            arcu nunc. Etiam pellentesque quis nibh et volutpat. Phasellus
            finibus eros in arcu pretium faucibus. Donec euismod sapien a
            porttitor commodo. Praesent tristique faucibus efficitur. Donec
            auctor consequat purus ut ullamcorper. Aliquam molestie finibus odio
            in imperdiet. Nullam molestie auctor justo, vitae vulputate augue
            volutpat a. In nulla mauris, suscipit ac venenatis non, sodales eget
            libero. Curabitur tristique, lacus tincidunt accumsan tempor, leo
            enim posuere diam, quis condimentum nibh nibh egestas sapien.
            Aliquam quis dolor faucibus diam dictum ornare a sed purus. Maecenas
            ac lorem vel nisi molestie finibus. Sed molestie nulla eu augue
            porta, quis pellentesque elit egestas. Praesent sit amet sapien ac
            urna pharetra rhoncus id sed lorem. Pellentesque sollicitudin sit
            amet est gravida tincidunt. Integer vulputate congue pellentesque.
          </p>
        </r-card-section>
        <r-card-actions
          style="
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          "
        >
          <r-btn
            label="Agree"
            color="primary"
            @click="dialogOpen = !dialogOpen"
          />
        </r-card-actions>
      </r-card>
    </r-dialog>
  </div> -->
</template>

<script lang="ts">
import { RouterLink, RouterView } from "vue-router";

import { useRockhopper } from "@ldc_ulm/rockhopper";

export default {
  name: "",
  components: {},
  data() {
    return {
      prefix: "",
      tab: "first",
      helpDialogOpen: false,
      dialogOpen: false,
      transitionName: "",
    };
  },

  methods: {
    handleChosenFlow(chosenFlow: string) {
      if (chosenFlow === "/first-flow") {
        this.prefix = "/first-flow";
      } else if (chosenFlow === "/second-flow") {
        this.prefix = "/second-flow";
      }
    },

    toHelpRouting(requestNumber: number): void {
      this.$router.push({ path: "/help", query: { requestNumber } });
    },

    handleEvent(s) {
      console.log("handleEvent: ", s);
    },
  },

  mounted() {
    const chosenFlow = JSON.parse(window.localStorage.getItem("chosenFlow"));

    if (chosenFlow === "/first-flow") {
      this.prefix = "/first-flow";
    }

    const $r = useRockhopper();

    $r.iconSet.uploader["add"] = "lh:upload";

    $r.iconSet.arrow.dropdown = "lh:arrow-down";

    $r.iconSet.uploader["add"] = "lh:plus";
  },

  watch: {
    $route(to, from) {
      const toDepth = to.path.split("/").length;
      const fromDepth = from.path.split("/").length;
      this.transitionName = toDepth < fromDepth ? "slide-right" : "slide-left";
    },
  },

  computed: {
    getRoute() {
      if (this.prefix == "/first-flow") {
        return this.prefix + "/voucher";
      }

      return "/second-flow/app";
    },
  },
};
</script>

<style>
.arrow {
  position: absolute;
  top: 50px;
  right: 50px;
}
</style>
