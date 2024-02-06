import ResponseDto from '../response.dto';

/**
 * 부모 인터페이스에서 정의된 속성들은 자식 인터페이스에서 자동으로 상속된다.
 * ResponseDto 인터페이스에 정의된 code 와 message 를 사용할 수 있게 된다.
 */
export default interface PostBoardResponseDto extends ResponseDto {}
