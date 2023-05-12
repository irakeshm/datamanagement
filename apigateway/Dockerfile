FROM maven:3.8-openjdk-17-slim as maven_build

WORKDIR /app
COPY ../pom.xml .
COPY ../src ./src

RUN mkdir -p /root/.m2 && mkdir /root/.m2/repository
#COPY .mvn/settings.xml/root/.m2/settings.xml
#RUN mun clean install
RUN --mount=type=cache,target=/root/.m2/repository mvn clean install
RUN mkdir -p target/docker-packaging && cd target/docker-packaging && jar -xf ../apigateway**.jar
#＃######JRE pun stage#######＃
#FROM openjdk:11.0-ire-buster
#FROM maven:3.8-openidk-17-sLim
FROM eclipse-temurin:17.0.1_12-jre-centos7
RUN groupadd app && adduser --system -g app app
USER app
WORKDIR /app

ARG DOCKER_PACKAGING_DIR=/app/target/docker-packaging
COPY --from=maven_build ${DOCKER_PACKAGING_DIR}/BOOT-INF/lib /app/lib
COPY --from=maven_build ${DOCKER_PACKAGING_DIR}/BOOT-INF/classes /app/classes
COPY --from=maven_build ${DOCKER_PACKAGING_DIR}/META-INF /app/META-INF
COPY --from=maven_build /app/target/apigateway*.jar /app/application.jar
ENV JVM_OPTIONS=""
ENV MY_ENV_VAR_KEY="MY_ENV_VAR_VAL"
ENV MY_ENV_VAR_KEY_2="MY_ENV_VAR_VAL_2"
EXPOSE 8080
CMD java $JVM_OPTIONS -jar /app/application.jar