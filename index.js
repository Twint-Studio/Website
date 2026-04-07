import { cp, rm } from "fs/promises";

const src = `${__dirname}/src`;
const dist = `${__dirname}/dist`;

const output = `${dist}/index.html`;

import services from "./data.json" with { type: "json" };

try {
    await rm(dist, { recursive: true, force: true });
    await cp(src, dist, { recursive: true });

    const template = await Bun.file(`${src}/index.html`).text();
    const html = services.map(({ title, description, link, mirror }) => {
        const links = (Array.isArray(link) ? link : [link]).filter(Boolean);
        const mirrors = (Array.isArray(mirror) ? mirror : [mirror]).filter(Boolean);

        const buttons = links
            .map((url, i) => {
                const label = links.length > 1 ? `Open Service ${i + 1}` : "Open Service";
                return /* html */ `<a href="${url}"><button>${label} <i>link</i></button></a>`;
            })
            .join("");

        const mirrorButtons = mirrors
            .map((url, i) => {
                const label = mirrors.length > 1 ? `Mirror ${i + 1}` : "Mirror";
                return /* html */ `<a class="mirror-link" href="${url}"><button class="border">${label} <i>swap_horiz</i></button></a>`;
            })
            .join("");

        return /* html */ `
            <article class="round s12 m6 l4">
                <div class="row">
                    <div class="max">
                        <h5>${title}</h5>
                        <p>${description}</p>
                    </div>
                </div>
                ${buttons || mirrorButtons ? `<nav>${buttons}${mirrorButtons}</nav>` : ""}
            </article>
        `;
    }).join("");

    await Bun.write(output, template.replace("{{ services }}", html));

    console.info("✅");
} catch (err) {
    console.error("❌");
}