<template>
  <div id="main">
    <div class="wrapper">
      <div class="output">{{ output }}</div>
      <div class="keys">
        <button
          v-for="(digit, idx) in 10"
          :key="idx"
          :class="'digit-' + idx"
          @click="press(digit - 1)"
        >
          {{ digit - 1 }}
        </button>
        <button
          v-for="(operator, idx) in operators"
          :key="'op' + idx"
          :class="operator.name"
          @click="opKey(operator.symbol)"
        >
          {{ operator.symbol }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#main {
  display: flex;
  margin: auto;
  justify-content: center;
  .wrapper {
    width: 350px;
    min-height: 100px;
    border: solid 10px #000000;
    border-radius: 20px;
  }
  .output {
    padding: 10px;
    font-weight: bold;
    font-size: 30px;
    height: 80px;
    word-break: break-all;
    overflow-y: auto;
    text-align: right;
    border-bottom: solid 2px #000000;
  }
  .keys {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }
  button {
    height: 50px;
    font-weight: bold;
    font-size: 20px;
  }
  button:hover {
    background-color: rgb(220, 43, 226);
    cursor: pointer;
  }
  button:active {
    background-color: rgb(43, 226, 226);
  }
}
</style>

<script>
export default {
  name: "Calculator",
  data() {
    return {
      operators: [
        { name: "op-add", symbol: "+" },
        { name: "op-sub", symbol: "-" },
        { name: "op-mul", symbol: "*" },
        { name: "op-div", symbol: "/" },
        { name: "eq", symbol: "=" },
        { name: "clear", symbol: "C" },
      ],
      output: "",
      lastKeyType: null,
      result: null,
      engine: [],
    };
  },
  methods: {
    press(digit) {
      if (digit === "") {
        return;
      }
      if (this.lastKeyType === "digit") {
        let value = this.engine[this.engine.length - 1];
        let newValue;
        if (
          this.output[this.output.length - 2] === "-" &&
          this.output[this.output.length - 1] === "0"
        ) {
          newValue = -1 * digit;
        } else {
          newValue = `${value}` + `${digit}`;
        }
        this.engine.splice(this.engine.length - 1, 1, parseInt(newValue));
        if (this.output.length === 1 && this.output[0] === "0" && digit === 0) {
          return;
        } else if (
          this.output.length === 1 &&
          this.output[0] === "0" &&
          digit !== 0
        ) {
          this.output = `${digit}`;
        } else if (
          ["+", "-", "*", "/"].includes(this.output[this.output.length - 2]) &&
          this.output[this.output.length - 1] === "0"
        ) {
          if (
            this.output[this.output.length - 2] === "-" &&
            this.output[this.output.length - 1] === "0"
          ) {
            this.output =
              this.output.substring(0, this.output.length - 2) +
              parseInt(newValue);
          } else {
            this.output =
              this.output.substring(0, this.output.length - 1) +
              parseInt(newValue);
          }
        } else {
          this.output += `${digit}`;
        }
      } else {
        this.lastKeyType = "digit";
        if (this.engine[this.engine.length - 1] === "-") {
          if (
            (this.output.length === 1 && this.output === "-") ||
            ["*", "/"].includes(this.engine[this.engine.length - 2])
          ) {
            this.engine.splice(this.engine.length - 1, 1, -1 * parseInt(digit));
          } else {
            this.engine.push(parseInt(digit));
          }
        } else {
          this.engine.push(parseInt(digit));
        }
        if (this.result) {
          this.engine = [];
          this.engine.push(parseInt(digit));
          this.output = `${digit}`;
          this.result = null;
        } else {
          this.output += `${digit}`;
        }
      }
    },

    multiply() {
      this.output += "*";
    },

    divide() {
      this.output += "/";
    },

    plus() {
      this.output += "+";
    },

    minus() {
      this.output += "-";
    },

    clear() {
      this.output = "";
      this.engine = [];
      this.lastKeyType = null;
      return;
    },

    opKey(key) {
      this.result = null;
      if (
        (["+", "-", "*", "/"].includes(key) && this.output !== "") ||
        key === "-"
      ) {
        if (this.lastKeyType === "opCode") {
          if (
            ["*", "/"].includes(this.output[this.output.length - 1]) &&
            key === "-"
          ) {
            this.engine.push(key);
            this.output += key;
          } else if (
            this.output[this.output.length - 1] !== "-" ||
            (this.output.length >= 2 &&
              !["*", "/"].includes(this.output[this.output.length - 2]))
          ) {
            this.engine.splice(this.engine.length - 1, 1, key);
            this.output =
              this.output.substring(0, this.output.length - 1) + key;
          } else {
            return;
          }
        } else {
          this.lastKeyType = "opCode";
          this.engine.push(key);
          this.output += key;
        }
      } else {
        switch (key) {
          case "=":
            this.equals();
            break;
          case "C":
            this.clear();
            break;
          default:
            break;
        }
      }
    },

    equals() {
      if (this.lastKeyType === "digit") {
        if (
          this.output[this.output.length - 1] === "0" &&
          this.output[this.output.length - 2] !== "*"
        ) {
          if (
            this.output[this.output.length - 2] === "/" ||
            (this.output[this.output.length - 3] === "/" &&
              this.output[this.output.length - 2] === "-")
          ) {
            this.clear();
            return;
          }
        }

        const calculate = (s) => {
          // Stack for numbers: 'values'
          const values = [];
          // Stack for Operators: 'ops'
          const ops = [];

          for (let i = 0; i < s.length; i++) {
            // Current token is a whitespace, skip it
            if (s[i] === " ") {
              continue;
            }
            // Current token is an operator.
            else if (
              s[i] === "+" ||
              s[i] === "-" ||
              s[i] === "*" ||
              s[i] === "/"
            ) {
              // While top of 'ops' has same or greater precedence to current
              // token, which is an operator. Apply operator on top of 'ops'
              // to top two elements in values stack
              while (ops.length && hasPrecedence(s[i], ops[ops.length - 1])) {
                values.push(applyOp(ops.pop(), values.pop(), values.pop()));
              }
              // Push current token to 'ops'.
              ops.push(s[i]);
            }
            // Current token is a number, push it to stack for numbers
            else {
              values.push(parseInt(s[i]));
            }
          }

          // Entire expression has been parsed at this point, apply remaining
          // ops to remaining values
          while (ops.length) {
            values.push(applyOp(ops.pop(), values.pop(), values.pop()));
          }

          // Top of 'values' contains result, return it
          return values.pop();
        };

        // Returns true if 'op2' has higher or same precedence as 'op1',
        // otherwise returns false.
        const hasPrecedence = (op1, op2) => {
          if (op2 === "(" || op2 === ")") {
            return false;
          }
          if ((op1 === "*" || op1 === "/") && (op2 === "+" || op2 === "-")) {
            return false;
          }
          return true;
        };

        // A utility method to apply an operator 'op' on operands 'a'
        // and 'b'. Return the result.
        const applyOp = (op, b, a) => {
          switch (op) {
            case "+":
              return a + b;
            case "-":
              return a - b;
            case "*":
              return a * b;
            case "/":
              if (b === 0) {
                throw "Cannot divide by zero";
              }
              return Math.floor(a / b);
          }
          return 0;
        };
        const res = isNaN(calculate(this.engine))
          ? calculate(this.engine)
          : calculate(this.engine);
        console.log(this.engine, calculate(this.engine), this.output, "equal");
        this.clear();
        if (res !== "") {
          this.lastKeyType = null;
          this.result = true;
          this.engine.push(parseInt(res));
        }
        this.output = `${res}`;
      }
    },
  },
};
</script>
