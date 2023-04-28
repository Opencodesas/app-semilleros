import dayjs from "dayjs";
import Litepicker from "litepicker";
/*
import {
  LitepickerElement,
  LitepickerProps,
  LitepickerEmit,
} from "./Litepicker.vue";


interface Picker extends Litepicker {
  on?: (
    event: string,
    cb: (
      startDate: {
        dateInstance: Date;
      },
      endDate: {
        dateInstance: Date;
      }
    ) => void
  ) => {};
}
*/

const getDateFormat = (format: string | undefined) => {
  return format !== undefined ? format : "D MMM, YYYY";
};

const setValue = (props: any, emit: any) => {
  const format = getDateFormat(props.options.format);
  if (!props.modelValue.length) {
    let date = dayjs().format(format);
    date +=
      !props.options.singleMode && props.options.singleMode !== undefined
        ? " - " + dayjs().add(1, "month").format(format)
        : "";
    emit("update:modelValue", date);
  }
};

const init = (
  el: any,
  props: any,
  emit: any
) => {
  const format = getDateFormat(props.options.format);
  el.litePickerInstance = new Litepicker({
    ...props.options,
    element: el,
    format: format,
    setup: (picker: Litepicker) => {
      if (picker.on) {
        picker.on("selected", (startDate: any, endDate: any) => {
          let date = dayjs(startDate.dateInstance).format(format);
          date +=
            endDate !== undefined
              ? " - " + dayjs(endDate.dateInstance).format(format)
              : "";
          emit("update:modelValue", date);
        });
      }
    },
  });
};

const reInit = (
  el: any,
  props: any,
  emit: any
) => {
  el.litePickerInstance.destroy();
  init(el, props, emit);
};

export { setValue, init, reInit };
