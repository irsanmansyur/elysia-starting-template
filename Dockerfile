FROM oven/bun:1.2.15 AS base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.loc* /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# install with --production (exclude devDependencies)
RUN mkdir -p /temp/prod
COPY package.json bun.loc* /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
WORKDIR /app
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

# [optional] tests
ENV NODE_ENV=production
RUN bun test

# copy production dependencies and source code into final image
FROM oven/bun:1.2.15-alpine AS release
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /app/src ./src
COPY --from=prerelease /app/utils ./utils
COPY --from=prerelease /app/package.json .
COPY --from=prerelease /app/tsconfig.json .

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "src/index.ts" ]
