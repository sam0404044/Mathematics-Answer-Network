import styles from "./About.module.css";

export default function About() {
  return (
    <article className={styles.about}>
      <img src="/img/testimage.jpg" className={styles.img} />
      <h1 className={styles.h1}>About our site</h1>
      <p className={styles.p}>
        Lorem ipsum dolor sit amet consectetur. Neque lectus quam tincidunt ligula nunc. Faucibus risus mi lacus
        pellentesque mauris donec. Senectus vitae orci aliquam bibendum. Ac augue volutpat leo scelerisque enim cras
        dictumst nulla. Condimentum ornare mattis donec quam. Et feugiat ornare hac.
      </p>
    </article>
  );
}
