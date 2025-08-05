extern crate meval;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn calculate(expression: &str) -> String {
    match meval::eval_str(expression) {
        Ok(x) => x.to_string(),
        Err(e) => format!("Invalid expression: {e}"),
    }
}
