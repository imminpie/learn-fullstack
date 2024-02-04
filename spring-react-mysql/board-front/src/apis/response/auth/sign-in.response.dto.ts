import ResponseDto from '../response.dto';

export default interface SignInResponseDto extends ResponseDto {
  /**
   * ResponseDto 인터페이스 정의된 속성은 자식 인터페이스에 자동으로 상속된다.
   * 추가로 필요한 속성만 작성하도록 한다.
   */
  token: string;
  expirationTime: number;
}
