type ScrollController = {
  scrollTo: (target: HTMLElement, options: { offset: number; duration: number }) => void;
};

const extraOffset = 89;

export function scrollToSection(id: string, controller: ScrollController | null | undefined): boolean {
  const target = document.getElementById(id);
  if (!target) return false;

  const headerHeight = document.querySelector("header")?.getBoundingClientRect().height ?? 80;
  const offset = -(headerHeight - extraOffset);

  if (controller) {
    controller.scrollTo(target, { offset, duration: 0.65 });
  } else {
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
  }

  const url = new URL(window.location.href);
  url.hash = `#${id}`;
  window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  return true;
}
