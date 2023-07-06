package board.file.dto.page;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PageResponseDTO<E> {
    private List<E> list;
    private int total;

    @Builder(builderMethodName = "withAll")
    public PageResponseDTO(List<E> list, int total) {
        this.list = list;
        this.total = total;
    }
}
