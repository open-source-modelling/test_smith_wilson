<template>
  <v-container>
    <div class="main">
      <br />
      <br />
      <v-row class="text-center">
        <v-col cols="2" class="mb-5">
          <v-text-field
            label="Number of variables"
            v-model="num_var"
            :rules="rules"
            outlined
            @keypress="isNumber($event, false)"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="mb-5">
          <v-text-field
            label="Number of targets"
            v-model="num_targ"
            :rules="rules"
            outlined
            @keypress="isNumber($event, false)"
          ></v-text-field>
        </v-col>
        <v-col cols="2" class="mb-5">
          <v-btn color="accent" elevation="2" x-large @click="generateInputs()"
            >Generate inputs</v-btn
          >
        </v-col>
      </v-row>

      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row class="text-center">
          <v-col cols="2" class="mb-5">
            <v-text-field
              label="UFR"
              v-model="ufr"
              :rules="rules"
              outlined
              @keypress="isNumber($event, true)"
            ></v-text-field>
          </v-col>
          <v-col cols="2" class="mb-5">
            <v-text-field
              label="ALPHA"
              v-model="alpha"
              :rules="rules"
              outlined
              @keypress="isNumber($event, true)"
            ></v-text-field>
          </v-col>
        </v-row>

        <v-row class="text-center">
          <v-col cols="5" class="mb-4">
            <!-- Header -->
            <v-row>
              <v-col cols="3"> Index </v-col>
              <v-col cols="3"> Int rate </v-col>
              <v-col cols="3"> Maturities </v-col>
            </v-row>

            <!-- Data -->
            <v-row v-for="(irate, index) in interest_rate_arr" :key="index">
              <v-col cols="3" class="d-flex justify-center align-center">
                {{ index + 1 }}
              </v-col>
              <v-col cols="3">
                <v-text-field
                  outlined
                  dense
                  hide-details
                  v-model="interest_rate_arr[index]"
                  :rules="rules"
                  @keypress="isNumber($event, true)"
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-text-field
                  outlined
                  dense
                  hide-details
                  v-model="maturities_arr[index]"
                  :rules="rules"
                  @keypress="isNumber($event, false)"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-col>

          <v-col cols="5" class="mb-4">
            <!-- Header -->
            <v-row>
              <v-col cols="3"> Index </v-col>
              <v-col cols="3"> Target </v-col>
              <v-col
                cols="6"
                v-if="calibrate_result"
                class="primary--text text-lg-h6"
              >
                Result
              </v-col>
            </v-row>

            <!-- Data -->
            <v-row v-for="(target, index) in targets_arr" :key="index">
              <v-col cols="3" class="d-flex justify-center align-center">
                {{ index + 1 }}
              </v-col>
              <v-col cols="3">
                <v-text-field
                  outlined
                  dense
                  hide-details
                  v-model="targets_arr[index]"
                  :rules="rules"
                  @keypress="isNumber($event, true)"
                ></v-text-field>
              </v-col>
              <v-col
                v-if="calibrate_result"
                cols="6"
                class="primary--text text-lg-h6 d-flex justify-center align-center"
              >
                {{ calibrate_result[index][0] }}
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="text-center">
          <v-col cols="2" class="mb-5">
            <v-btn color="accent" elevation="2" x-large @click="calculateSW()"
              >Calculate</v-btn
            >
          </v-col>
        </v-row>
      </v-form>

      <br />
      <br />

      <v-row class="text-center" v-if="calibrate_result">
        <v-col class="mb-5">
          <P class="primary--text"> RESULT: </P>
          <P class="primary--text"> {{ calibrate_result }} </P>
        </v-col>
      </v-row>
      <!-- <v-row class="text-center">
      <div class="graphs_container">
        <Graph
          v-show="calibrate_result"
          :graph_data="generate_bar_graph_data()"
          :graph_layout="graph_layout()"
          :display-mode-bar="false"
        ></Graph>
      </div>
    </v-row> -->
    </div>
  </v-container>
</template>

<script>
//import Graph from "@/components/Graph.vue";
import { inv } from "mathjs";

export default {
  name: "Main",

  components: {
    //Graph,
  },

  data: () => ({
    valid: true,
    rules: [(value) => !!value || "Required"],
    num_var: 5,
    num_targ: 10,
    interest_rate_arr: [],
    maturities_arr: [],
    targets_arr: [],
    ufr: null,
    alpha: null,
    calibrate_result: null,
  }),

  methods: {
    // Check if input is a number or comma (for number cell)
    isNumber(evt, isFloat) {
      evt = evt ? evt : window.event;

      var charCode = evt.which ? evt.which : evt.keyCode;

      //if comma, ignore if comma already exist and if string is empty
      if (
        isFloat &&
        charCode == 46 &&
        (evt.target.value.includes(".") || evt.target.value == "")
      )
        evt.preventDefault();
      //some basic keys (delete, backspace,... + numbers + comma for decimal)
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        (!isFloat || charCode !== 46)
      )
        evt.preventDefault();
      else return true;
    },

    graph_layout() {
      return {
        //title: this.trends_data[this.param_code] ? this.trends_data[this.param_code].var_name : '',
        showlegend: false,
        xaxis: {
          type: "category",
        },
      };
    },

    generate_bar_graph_data() {
      let data = [];

      if (this.calibrate_result) {
        data.push({
          x: Object.keys(this.calibrate_result),
          y: this.calibrate_result,
          /* name: this.truncate(
                this.organizations[this.org_type][org_code].name
              ), */
          //visible: this.org_type == 0 ? true : 'legendonly',
          type: "bar",
        });
      }

      return data;
    },

    generateInputs() {
      this.calibrate_result = null;
      this.interest_rate_arr = Array(parseInt(this.num_var));
      this.maturities_arr = Array(parseInt(this.num_var));
      this.targets_arr = Array(parseInt(this.num_targ));
    },

    calculateSW() {
      this.$refs.form.validate();

      if (
        this.ufr &&
        this.alpha &&
        !this.interest_rate_arr.includes(undefined) &&
        !this.maturities_arr.includes(undefined) &&
        !this.interest_rate_arr.includes("") &&
        !this.maturities_arr.includes("") &&
        !this.targets_arr.includes("") &&
        !this.targets_arr.includes(undefined)
      ) {
        let calibration = this.SWCalibrate(
          this.interest_rate_arr.map(Number),
          this.maturities_arr.map(Number),
          parseFloat(this.ufr),
          parseFloat(this.alpha)
        );

        let extrapolation = this.SWExtrapolate(
          this.targets_arr.map(Number),
          this.maturities_arr.map(Number),
          calibration.map(Number),
          parseFloat(this.ufr),
          parseFloat(this.alpha)
        );

        this.calibrate_result = extrapolation;
      } //else this.calibrate_result = "Please fill required fields";
    },

    SumVecSpecial(a, b) {
      /**
       * Sum vectors where the first vector is a column vector of type a = [[1],[2]]
       * @param {Array} a first array of arrays of length 1
       * @param {Array} b second array of numbers
       * @return {Array}  array where each element is calculated as a + b
       */
      const len = a.length;
      let out = Array(len);
      for (let col = 0; col < len; col++) {
        out[col] = a[col] + b[col];
      }
      return out;
    },

    diffVec(a, b) {
      /**
       * Element-wise subtracts vector b from vector a
       * @param {Array} a first array of numbers.
       * @param {Array} b second array of numbers.
       * @return {Array}  array where each element is calculated as a minus b
       */
      const len = a.length;
      let out = Array(len);
      for (let col = 0; col < len; col++) {
        out[col] = a[col] - b[col];
      }
      return out;
    },

    multiply(A, B) {
      /**
       * Matrix multiplication of matrices A and B so A*B
       * @param {Array} A Array of arrays where the len of outer array is the number of rows and the inner aray is the number of columnet. Ex. A=[[1,2],[3,4]]
       * @param {Array} B Array of arrays where the len of outer array is the number of rows and the inner aray is the number of columnet. Ex. B=[[5,6],[7,8]]
       * @return {Array}  Array of arrays calculated as a matrix product of A and B; A*B; Ex. out = [[19, 22], [43, 50]]
       */

      const aNumRows = A.length,
        aNumCols = A[0].length,
        bNumCols = B[0].length,
        out = new Array(aNumRows); // initialize array of rows
      for (let row = 0; row < aNumRows; ++row) {
        out[row] = new Array(bNumCols); // initialize the current row
        for (let col = 0; col < bNumCols; ++col) {
          out[row][col] = 0; // initialize the current cell
          for (let i = 0; i < aNumCols; ++i) {
            out[row][col] += A[row][i] * B[i][col];
          }
        }
      }
      return out;
    },

    multiplyMatVec(A, b) {
      /**
       * Matrix multiplication of a matrix A and a vector b so A*b
       * @param {Array} A Array of arrays where the len of outer array is the number of rows and the inner aray is the number of columnet. Ex. A=[[1,2],[3,4]]
       * @param {Array} b Array of numbers Ex. B=[5,6]
       * @return {Array}  Array of arrays calculated as a matrix product of A and b; A*b; Ex. out = [[17],[39]]
       */
      let aNumRows = A.length,
        aNumCols = A[0].length,
        out = new Array(aNumRows); // initialize array of rows
      for (let row = 0; row < aNumRows; ++row) {
        out[row] = new Array(1); // initialize the current row
        out[row] = 0; // initialize the current cell
        for (let i = 0; i < aNumCols; ++i) {
          out[row] += A[row][i] * b[i];
        }
      }
      return out;
    },

    constructIdentity(dim) {
      /**
       * Construct an identity matrix where every element is equal to 0 except the diagonal elements that have 1
       * @param {Int} dimension of the identity matrix. Ex dim = 2
       * @return {Array} returns an array of arrays representing the identity matrix out = [[1,0],[0,1]]
       */
      const out = [];
      for (let row = 0; row < dim; row++) {
        if (!out[row]) {
          out[row] = [];
        }
        for (let col = 0; col < dim; col++) {
          if (row === col) {
            out[row][col] = 1;
          } else {
            out[row][col] = 0;
          }
        }
      }
      return out;
    },

    constructZeros(nrow, ncol) {
      /**
       * Construct a matrix with nrow rows and ncol columns where every element is equal to 0
       * @param {Int} nrow number of rows of the identity matrix. Ex nrow = 2
       * @param {Int} ncol number of columns of the identity matrix. Ex nrow = 3
       * @return {Array} returns an array of arrays representing the zero matrix out = [[0,0,0],[0,0,0]]
       */

      let out = [];
      for (let row = 0; row < nrow; row++) {
        if (!out[row]) {
          out[row] = [];
        }
        for (let col = 0; col < ncol; col++) {
          out[row][col] = 0;
        }
      }
      return out;
    },

    SWHeart(u, v, alpha) {
      /**
       * Calculate the matrix H (Heart of the Wilson function)
       * @param {Array} u  n_1 x 1 array arrays of maturities. Ex. u = [[1], [3]]
       * @param {Array} v  n_2 x 1 array of arrays of maturities. Ex. v = [[1], [2], [3], [5]]
       * @param {Float} alpha  floating number representing the convergence speed parameter alpha. Ex. alpha = 0.05
       * @returns {Array}  n_1 x n_2 array of arrays representing the Heart of the Wilson function for selected maturities and parameter alpha. H is calculated as in the paragraph 132 of the EIOPA documentation.
       * For more information see https://www.eiopa.europa.eu/sites/default/files/risk_free_interest_rate/12092019-technical_documentation.pdf
       */

      const nrow = u.length,
        ncol = v.length;
      let H = new Array(nrow);

      // For each element, calculate heart of W
      for (let row = 0; row < nrow; row++) {
        H[row] = new Array(ncol);
        for (let col = 0; col < ncol; col++) {
          H[row][col] =
            0.5 *
            (alpha * (u[row] + v[col]) +
              Math.exp(-alpha * (u[row] + v[col])) -
              alpha * Math.abs(u[row] - v[col]) -
              Math.exp(-alpha * Math.abs(u[row] - v[col])));
        }
      }
      return H;
    },

    SWCalibrate(r_Obs, M_Obs, ufr, alpha) {
      /**
       * Calculate the calibration vector "b" using a Smith-Wilson algorithm
       * @param {Array} r_Obs n x 1 array of arrays representing rates, for which you wish to calibrate the algorithm. Each rate belongs to an observable zero coupon bond with a known maturity. Ex. r_Obs = [[0.0024], [0.0034]]
       * @param {Array} M_Obs m x 1 array of arrays representing maturities of bonds, that have rates provided in input (r_Obs). Ex. M_Obs=[[1], [3]]
       * @param {Float} ufr floating number, representing the ultimate forward rate. Ex. ufr = 0.042
       * @param {Float} alpha floating number representing the convergence speed parameter alpha. Ex. alpha = 0.05
       * @return {Array} n x 1 array of arrays representing the calibration vector "b" needed to interpolate and extrapolate b =[[14], [-21]]
       *  For more information see https://www.eiopa.europa.eu/sites/default/files/risk_free_interest_rate/12092019-technical_documentation.pdf
       */

      const len = r_Obs.length,
        C = this.constructIdentity(len);

      let p = Array(len),
        d = Array(len),
        q = Array(len),
        Q = this.constructZeros(len, len);

      for (let col = 0; col < len; col++) {
        p[col] = Math.pow(1 + r_Obs[col], -M_Obs[col]); //    p = (1+r).^(-M);
        d[col] = Math.exp(-Math.log(1 + ufr) * M_Obs[col]); //    d = exp(-log(1+ufr) .* M);
        Q[col][col] = C[col][col] * d[col]; //    Q = diag(d) * C;
      }

      q = this.multiplyMatVec(C, d); //    q = C'*d;
      let H = this.SWHeart(M_Obs, M_Obs, alpha); // Calculate SWHeart

      return this.multiplyMatVec(
        inv(this.multiply(this.multiply(Q, H), Q)),
        this.diffVec(p, q)
      ); //    b = (Q' * H * Q)\(p-q);
    },

    SWExtrapolate(M_Tar, M_Obs, b, ufr, alpha) {
      /**
       * Interpolate or/and extrapolate rates for targeted maturities using a Smith-Wilson algorithm.
       * @param {Array} M_Target k x 1 array of arrays. Each element represents a bond maturity of interest. Ex. M_Tar = [[1], [2], [3], [5]]
       * @param {Array} M_Obs n x 1 array of arrays. Observed bond maturities used for calibrating the calibration vector b. Ex. M_Obs = [[1], [3]]
       * @param {Array}  b  n x 1 array of arrays. Calibration vector "b" calculated on observed bonds.
       * @param {Float} ufr floating number, representing the ultimate forward rate. Ex. ufr = 0.042
       * @param {Float} alpha floating number representing the convergence speed parameter alpha. Ex. alpha = 0.05
       * @return {Array} k x 1 array of arrays. Represents the targeted rates for a zero-coupon bond. Each rate belongs to a targeted zero-coupon bond with a maturity from T_Target. Ex. r = [[0.0024], [0.0029], [0.0034], [0.0039]]
       * For more information see https://www.eiopa.europa.eu/sites/default/files/risk_free_interest_rate/12092019-technical_documentation.pdf
       */

      const obsLen = M_Obs.length,
        tarLen = M_Tar.length,
        C = this.constructIdentity(obsLen);
      let d = Array(obsLen),
        Q = this.constructZeros(obsLen, obsLen),
        expom = Array(tarLen),
        dDiag = this.constructZeros(tarLen, tarLen),
        r = Array(tarLen);

      for (let col = 0; col < obsLen; col++) {
        d[col] = Math.exp(-Math.log(1 + ufr) * M_Obs[col]);
        Q[col][col] = C[col][col] * d[col];
      }
      let H = this.SWHeart(M_Tar, M_Obs, alpha);

      for (let col = 0; col < tarLen; col++) {
        dDiag[col][col] = Math.exp(-Math.log(1 + ufr) * M_Tar[col]);
        expom[col] = Math.exp(-Math.log(1 + ufr) * M_Tar[col]);
      }

      let p = this.SumVecSpecial(
        this.multiplyMatVec(this.multiply(this.multiply(dDiag, H), Q), b),
        expom
      );

      for (let col = 0; col < tarLen; col++) {
        r[col] = [Math.pow(p[col], -1 / M_Tar[col]) - 1];
      }

      return r;
    },
  },
  created() {
    this.generateInputs();
  },
};
</script>
