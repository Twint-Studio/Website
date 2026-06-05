import { cp, rm } from "fs/promises";

const src = `${__dirname}/src`;
const dist = `${__dirname}/dist`;

const output = `${dist}/index.html`;

import services from "./data.json" with { type: "json" };

try {
    await rm(dist, { recursive: true, force: true });
    await cp(src, dist, { recursive: true });

    const template = await Bun.file(`${src}/index.html`).text();
    const html = services.map(({ title, description, link }) => {
        const links = (Array.isArray(link) ? link : [link]).filter(Boolean);

        const buttons = links
            .map((url, i) => {
                const label = links.length > 1 ? `Open Service ${i + 1}` : "Open Service";
                return /* html */ `<a class="button button-primary card-button" href="${url}">${label} <svg width="16" height="16"><use xlink:href="#link-icon"/></svg></a>`;
            })
            .join("");

        return /* html */ `
            <div class="card card-rounded card-background card-shadow">
                <h5 class="card-title">${title}</h5>
                <p class="card-description">${description}</p>
                ${buttons ? `<div class="card-buttons">${buttons}</div>` : ""}
            </div>
        `;
    }).join("");

    await Bun.write(output, template.replace("{{ services }}", html));

    console.info("✅");
} catch (err) {
    console.error("❌");
}