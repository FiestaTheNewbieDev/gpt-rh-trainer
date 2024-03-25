export default interface IMessage {
  role: "user" | "system" | "assistant";
  content: string;
}
